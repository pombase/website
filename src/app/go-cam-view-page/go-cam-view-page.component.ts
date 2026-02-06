import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Params, Router } from '@angular/router';
import { DomSanitizer, Meta, SafeResourceUrl, Title } from '@angular/platform-browser';
import { AppConfig, getAppConfig } from '../config';
import { PombaseAPIService, GoCamSummary, GeneSummaryMap, GeneSummary, GeneShort, GeneUniquename } from '../pombase-api.service';
import { TextOrTermId, Util } from '../shared/util';
import { DeployConfigService } from '../deploy-config.service';
import { GeneBoolNode, GeneListNode, GeneQuery, IntRangeNode } from '../pombase-query';
import { HistoryEntry, QueryService } from '../query.service';
import { QueryRouterService } from '../query-router.service';

@Component({
    selector: 'app-go-cam-view-page',
    templateUrl: './go-cam-view-page.component.html',
    styleUrls: ['./go-cam-view-page.component.css'],
    standalone: false
})
export class GoCamViewPageComponent implements OnInit {
  appConfig: AppConfig = getAppConfig();

  sanitizedURL?: SafeResourceUrl;

  gocamIdParam?: string;
  gocamIds: Array<string> = [];
  paramFlags: Array<string> = [];
  gocamDetailsList: Array<GoCamSummary> = [];
  overlappingGene?: GeneShort;
  contributorNames?: string;
  sourcePageType = 'gene';
  source?: string;
  sourceName?: string;
  sourceGenes: Set<GeneUniquename> = new Set();
  modelGenes: Array<GeneSummary> = [];
  targetGenes: Array<GeneSummary> = [];
  geneSummaryMap?: GeneSummaryMap;
  titleParts: Array<Array<TextOrTermId>> = [];
  isPomBaseView = false;
  isMegaModel = false;
  showChemicals = true;
  showTargets = true;
  showModelBoxes = true;
  mergeByChemical = false;
  alternateViewRoute?: string;
  noctuaLink?: string;
  amigoLink?: string;
  queryResultCache: { [key:string]: Promise<string> } = {};

  showChemicalsEnabled = true;
  showTargetsEnabled = true;

  constructor(private titleService: Title,
              private sanitizer: DomSanitizer,
              private readonly meta: Meta,
              private deployConfig: DeployConfigService,
              private route: ActivatedRoute,
              private router: Router,
              private queryService: QueryService,
              private queryRouterSerice: QueryRouterService,
              private pombaseApi: PombaseAPIService) { }

  getIFrameURL(): SafeResourceUrl | undefined {
    return this.sanitizedURL;
  }

  devMode(): boolean {
    return this.deployConfig.devMode();
  }

  getTitleOrId(): string|undefined {
    if (this.gocamIdParam) {
      if (this.gocamDetailsList.length > 0) {
        return this.gocamDetailsList.map((details) => details.title).join(', ');
      } else {
        return this.gocamIdParam;
      }
    } else {
      return undefined;
    }
  }

  setContributors() {
    this.contributorNames = undefined;
    if (this.gocamDetailsList.length > 0) {
      let contributorNamesList: Array<String> = [];
      for (const details of this.gocamDetailsList) {
        for (const contributor of details.contributors) {
          if (!contributorNamesList.includes(contributor.name)) {
            contributorNamesList.push(contributor.name);
          }
        }
      }
      this.contributorNames = contributorNamesList.join(', ');
    }
  }

  setPageTitle(): void {
    let title;
    if (this.gocamIdParam) {
      title = this.appConfig.site_name + ' - GO-CAM Pathway - ' + this.getTitleOrId();
    } else {
      title = this.appConfig.site_name + ' - GO-CAM Pathway';
    }
    this.titleService.setTitle(title);
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'description', content: title });
  }

  setTitleParts(): void {
    this.titleParts = [];
    for (const detail of this.gocamDetailsList) {
      const splitDesc = Util.splitDescription(detail.title, detail.title_terms ?? []);
      this.titleParts.push(splitDesc);
    }
  }

  isMergedModel(): boolean {
    if (this.gocamIdParam && this.gocamIdParam.startsWith('ALL')) {
      return true;
    }

    if (!this.gocamIds) {
      return false;
    }
    return this.gocamIds.length > 1;
  }

  updateUrl(): void {
    let rawUrl;

    const currentUrl = decodeURIComponent(this.router.url);

    if (this.isPomBaseView) {
      let idForUrl = this.gocamIdParam;
      let flags = [...this.paramFlags];
      if (!this.showChemicals) {
        flags.push("no_chemicals");
      }
      if (!this.showTargets) {
          flags.push("no_inputs");
      }
      if (this.mergeByChemical) {
        flags.push("merge_by_chemical");
      }

      if (this.showModelBoxes) {
        flags.push("show_models");
      } else {
        flags.push("hide_models");
      }

      if (flags.length > 0) {
        idForUrl += ':' + flags.join(",")
      }
      if (this.source) {
        rawUrl = 'gocam_view/full/' + idForUrl + '/' + this.source;
      } else {
        rawUrl = 'gocam_view/full/' + idForUrl;
      }

      this.alternateViewRoute = currentUrl.replace('/gocam/pombase-view/', '/gocam/view/');
    } else {
      rawUrl = 'gocam_viz/full/' + this.gocamIdParam;

      this.alternateViewRoute = currentUrl.replace('/gocam/view/', '/gocam/pombase-view/');
    }

    this.sanitizedURL = this.sanitizer.bypassSecurityTrustResourceUrl(rawUrl);
  }

  makeGenesUrl(): string {
    const geneList = this.modelGenes.map(g => { return { uniquename: g.uniquename } });
    let desc = this.sourceName || this.getTitleOrId() || 'GO-CAM pathway model';
    const query = {
      "constraints": {
        "node_name": "Genes from GO-CAM pathway: " + desc,
        "gene_list" : {"genes": geneList }
      },
      "output_options": {
        "field_names": ["gene_uniquename"],
        "sequence": "none"
      }
    };

    return `/results/from/json/${JSON.stringify(query)}`;
  }

  makeGeneInGoCamsQuery(op: string): GeneQuery|undefined {
    if (this.source && this.sourceName) {
      const genes = this.source.split(',');
      const rangeName = "Genes that enable activities in GO-CAM pathway models";

      const geneListNode = new GeneListNode(this.sourceName, genes);
      const activityGenesNode =
            new IntRangeNode(rangeName, "gocam_activity_gene_count", 1, undefined, []);

      const parts = [geneListNode, activityGenesNode];

      let booleanNode;

      if (op == 'and') {
        booleanNode = new GeneBoolNode(this.sourceName + ' AND ' +
                                       rangeName, op, parts);
      } else {
        booleanNode = new GeneBoolNode(this.sourceName + ' NOT ' +
                                       rangeName, op, parts);
      }

      return new GeneQuery(booleanNode);
    } else {
      return undefined;
    }
  }

  async getQueryCount(query: GeneQuery): Promise<number> {
    return this.queryService.postQueryCount(query).then(res => res.getRowCount());
  }

  getGenesInGoCamsQueryCount(op: string): Promise<string> {
    const key = 'getGenesInGoCamsQueryCount--' + op;
    if (key in this.queryResultCache) {
      return this.queryResultCache[key];
    }
    const query = this.makeGeneInGoCamsQuery(op);
    if (query === undefined) {
      return new Promise(() => 'unknown');
    } else {
      const promise = this.getQueryCount(query).then(count => count.toString());

      this.queryResultCache[key] = promise;

      return promise;
    }
  }

  gotoGenesInGoCamQuery(op: string): void {
    const geneQuery = this.makeGeneInGoCamsQuery(op);
    if (geneQuery === undefined) {
      return;
    }

    const callback = (historyEntry: HistoryEntry) => {
      this.router.navigate(['/results/from/id/', historyEntry.getEntryId()]);
    };
    this.queryService.runAndSaveToHistory(geneQuery, callback);
  }

  gotoBPSlimGenesNotInPathway(): void {
    const query = this.makeGeneInGoCamsQuery('not')!;
    this.queryRouterSerice.gotoResults(query, 'slim:bp_goslim_pombe');
  }

  ngOnInit(): void {
    this.route.params.forEach((params: Params) => {
      this.gocamIds = [];
      this.gocamDetailsList = [];
      this.overlappingGene = undefined;
      this.gocamIdParam = params['gocam_id'];
      this.modelGenes = [];
      this.targetGenes = [];

      this.sourcePageType = params['source_page_type'];
      this.source = params['source'];
      this.sourceName = decodeURIComponent(params['source_name']);

      this.queryResultCache = {};

      if (this.source) {
        this.sourceGenes = new Set(this.source.split(','));
      } else {
        this.sourceGenes = new Set();
      }

      const pathSeg2 = this.route.snapshot.url[1].path;

      this.isPomBaseView = pathSeg2.includes('pombase-view');
      this.alternateViewRoute = undefined;
      this.noctuaLink = undefined;
      this.amigoLink = undefined;
      this.isMegaModel = false;

      if (this.gocamIdParam !== undefined) {
        const summPromise = this.pombaseApi.getGeneSummaryMapPromise();

        this.showChemicals = true;
        this.showTargets = false;

        if (this.gocamIdParam.includes(":")) {
          const [gocamId, flagString] = this.gocamIdParam.split(":");
          this.paramFlags = flagString.split(",");
          if (this.paramFlags.includes("no_chemicals")) {
            this.showChemicals = false;
          }
          if (this.paramFlags.includes("no_inputs")) {
            this.showTargets = false;
          }

          this.gocamIdParam = gocamId
        }

        this.gocamIds = this.gocamIdParam.split("+");

        if (/^[A-Z_]+$/.test(this.gocamIdParam)) {
          // fake details for ALL_MERGED or ALL_CONNECTED
          let title;
          if (this.gocamIdParam == "ALL_MERGED") {
            title = "All models merged";
            this.isMegaModel = true;
          } else {
            if (this.gocamIdParam == "ALL_CONNECTED") {
              title = "All connected models merged";
              this.isMegaModel = true;
            } else {
              title = this.gocamIdParam;
            }
          }
          if (this.isMegaModel) {
            this.showChemicals = false;
            this.showTargets = false;
          }
          this.gocamDetailsList = [
            {
              title,
            } as GoCamSummary];
        } else {

        this.showModelBoxes = this.isMergedModel() || this.paramFlags.includes('trim_models');

        const gocamDetailPromise = this.pombaseApi.getGoCamDetailByIds(this.gocamIds.join(","));

        Promise.all([summPromise, gocamDetailPromise])
           .then(([geneSummMap, gocamDetailsList]) => {
            this.gocamDetailsList = gocamDetailsList;
            const seenGenes = new Set();
            for (const detail of gocamDetailsList) {
              for (const geneUniquename of detail.activity_enabling_genes) {
                if (seenGenes.has(geneUniquename)) {
                  continue;
                }
                seenGenes.add(geneUniquename);
                const geneSumm = geneSummMap[geneUniquename];
                this.modelGenes.push(geneSumm);
              }
            }

            const seenTargetGenes = new Set();

            this.showChemicalsEnabled = false;
            this.showTargetsEnabled = false;

            for (const detail of gocamDetailsList) {
              if (detail.chemical_count > 0) {
                this.showChemicalsEnabled = true;
              } else {
                this.showChemicals = false;
              }
              if (detail.target_count > 0) {
                this.showTargetsEnabled = true;
              } else {
                this.showTargets = false;
              }
              for (const geneUniquename of detail.target_genes) {
                if (seenTargetGenes.has(geneUniquename)) {
                  continue;
                }
                seenTargetGenes.add(geneUniquename);
                const geneSumm = geneSummMap[geneUniquename];
                this.targetGenes.push(geneSumm);
              }
            }

            this.setContributors();

            const sorter = (a: GeneSummary, b: GeneSummary) => {
              if (!a.name && !b.name) {
                return a.uniquename.localeCompare(b.uniquename);
              }
              if (a.name && !b.name) {
                return -1;
              }
              if (!a.name && b.name) {
                return 1;
              }
              return a.name!.localeCompare(b.name!);
            };

            this.modelGenes.sort(sorter);
            this.targetGenes.sort(sorter);

              this.setTitleParts();

              if (gocamDetailsList.length > 1 && this.source && this.sourceName) {
                this.overlappingGene = { uniquename: this.source, name: this.sourceName } as GeneShort;
              }

             this.setPageTitle();
           });
        }

        this.updateUrl();

        if (!this.isMergedModel()) {
          this.noctuaLink = 'http://noctua.geneontology.org/workbench/noctua-visual-pathway-editor/?model_id=gomodel%3A' +
            this.gocamIds[0];
          this.amigoLink = 'https://amigo.geneontology.org/amigo/model/' + this.gocamIds[0];
        }

        this.setPageTitle();
      }
    });
  }
}
