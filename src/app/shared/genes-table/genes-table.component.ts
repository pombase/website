import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { PombaseAPIService, GeneSummaryMap, GeneShort } from '../../pombase-api.service';
import { GenesDownloadDialogComponent } from '../../genes-download-dialog/genes-download-dialog.component';
import { QueryService, HistoryEntry, DisplayResultRow } from '../../query.service';
import { GeneQuery, GeneListNode, TermAndName, QueryResult } from '../../pombase-query';
import { getAppConfig, GeneResultsFieldConfig } from '../../config';
import { DeployConfigService } from '../../deploy-config.service';
import { GenesTableConfigComponent } from '../../genes-table-config/genes-table-config.component';
import { SettingsService } from '../../settings.service';
import { Subscription } from 'rxjs';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { QueryRouterService } from '../../query-router.service';
import { Util } from '../util';

@Component({
  selector: 'app-genes-table',
  templateUrl: './genes-table.component.html',
  styleUrls: ['./genes-table.component.css']
})
export class GenesTableComponent implements OnInit {
  @Input() mode = 'results';
  @Input() description: string;

  // a decomposed version of the description as an Array of Objects
  // like: [{text: "abnormal cell ... ("}, {term: <a TermShort>}, {text: ")"}, ...]
  // which allows the the termids in a description to be linked to the term pages
  @Input() descriptionParts: Array<({ text?: string; term?: TermAndName; })> = [];
  @Input() genesOrResults: Array<GeneShort>|QueryResult;

  @ViewChild('interMineSendForm') interMineSendForm: ElementRef;
  @ViewChild('interMineSendFormExtIds') interMineExtIDsInput: ElementRef;

  queryResult: QueryResult;
  genes: Array<GeneShort> = [];

  legend = 'Results';

  faCog = faCog;

  orderByFieldName = 'product';
  orderByFieldIsNumeric = false;
  downloadModalRef: BsModalRef;
  selectedCountCache = -1;

  slimName?: string;

  visibleFieldNames: Array<string> = [];
  visibleFields: Array<GeneResultsFieldConfig> = [];

  visDescription: string;

  tooManyGenesTitle = 'Too many genes for select mode, try the "Gene list" option from the Search menu';
  selectGenesTitle = 'Start gene selection and filtering mode';

  selectedGenes?: { [key: string]: boolean };

  appConfig = getAppConfig();

  geneResultConfig = this.appConfig.getGeneResultsConfig();
  slimConfig = this.appConfig.slims;
  slimDescription?: string;

  slimNames: Array<string> = [];
  columnsSubscription: Subscription;

  displayGenes: Array<DisplayResultRow> = [];

  sanitizedDisplayGenes: Array<DisplayResultRow> = [];

  loading = true;

  showGeneExpressionLink = getAppConfig().geneExpression.datasets.length > 0;
  maxGeneExpressionPlotGenes = 150;

  intermineConfig = getAppConfig().intermine;

  constructor(private modalService: BsModalService,
              private sanitizer: DomSanitizer,
              private queryService: QueryService,
              private queryRouterSerive: QueryRouterService,
              private settingsService: SettingsService,
              private pombaseApiService: PombaseAPIService,
              public deployConfigService: DeployConfigService,
              private router: Router) {
    this.slimNames = this.geneResultConfig.slim_table_slim_names;

    this.visibleFieldNames = this.settingsService.visibleGenesTableFieldNames;
  }

  sanitizeDisplayGenes(): void {
    this.sanitizedDisplayGenes = [];

    for (let displayGene of this.displayGenes) {
      const cleanDisplayGene = Object.assign({}, displayGene);
      for (const fieldName of this.visibleFieldNames) {
        if (fieldName !== 'name' && fieldName !== 'uniquename' &&
            fieldName !== 'product') {
          const rawValue = displayGene[fieldName];
          if (typeof (rawValue) === 'string' && rawValue.length >= 25 &&
              rawValue.indexOf(',') !== -1) {
            const htmlValue = rawValue.replace(/,/g, ',&#8203;');
            cleanDisplayGene[fieldName] = this.sanitizer.bypassSecurityTrustHtml(htmlValue);
          }
        }
      }
      this.sanitizedDisplayGenes.push(cleanDisplayGene);
    }
  }

  sortDisplayGenes(): void {
    if (this.orderByFieldName === 'name' || this.orderByFieldName === '+name') {
      this.displayGenes.sort(Util.geneCompare);
    } else {
      if (this.orderByFieldName === 'uniquename' || this.orderByFieldName === '+uniquename') {
        this.displayGenes.sort((gene1, gene2) => {
          return gene1.uniquename.localeCompare(gene2.uniquename);
        })
      } else {
        this.displayGenes.sort((gene1, gene2) => {
          const fieldValue1 = (gene1 as any)[this.orderByFieldName];
          const fieldValue2 = (gene2 as any)[this.orderByFieldName];

          return Util.safeCompare(fieldValue1,
            fieldValue2,
            { numeric: this.orderByFieldIsNumeric });
        });
      }
    }

    this.sanitizeDisplayGenes();
  }

  updateDisplayGenes(): void {
    if (this.genes) {
      this.loading = true;
      this.queryService.queryGenesWithFields(this.genes.map(gene => gene.uniquename), this.visibleFieldNames)
        .then(result => {
          this.displayGenes = result;
          this.sortDisplayGenes();
          this.loading = false;
        })
        .catch(err => {
          console.error(err);
          this.loading = false;
        });

      let geneBit = `${this.genes.length} gene`;
      if (this.genes.length !== 1) {
        geneBit += 's';
      }

      if (this.showingVisualisation()) {
        this.legend = 'Visualising ' + geneBit;
      } else {
        if (this.showingSlim()) {
          this.legend = this.slimDescription + ' for ' + geneBit;
        } else {
          this.legend = 'Results - ' + geneBit;
        }
      }

    }
  }

  configureColumns(): void {
    const config = {
      animated: false,
      initialState: {
      },
      class: 'modal-lg',
    };
    this.downloadModalRef = this.modalService.show(GenesTableConfigComponent, config);
  }

  setOrderBy(fieldName: string) {
    this.orderByFieldName = fieldName;
    this.orderByFieldIsNumeric = false;

    for (const fieldConfig of this.visibleFields) {
      if (fieldConfig.name == fieldName) {
        if (fieldConfig.column_type === 'number' ||
            fieldConfig.column_type === 'expression_level' ||
            fieldConfig.column_type === 'bins') {
          this.orderByFieldIsNumeric = true;
        }

        break;
      }
    }

    this.sortDisplayGenes();
  }

  download() {
    const geneUniquenames = this.displayGenes.map(displayGene => displayGene.uniquename);
    const config = {
      animated: false,
      initialState: {
        initialFields: this.visibleFieldNames,
        geneUniquenames,
      },
      class: 'modal-lg',
    };
    this.downloadModalRef = this.modalService.show(GenesDownloadDialogComponent, config);
  }

  interMineButtonVisible(): boolean {
    return this.displayGenes.length > 0 && !!this.intermineConfig;
  }

  sendToInterMine(): void {
    if (this.interMineButtonVisible()) {
      const form = this.interMineSendForm;
      const idsInput = this.interMineExtIDsInput;

      const geneUniquenames = this.displayGenes.map(gene => gene.uniquename);

      idsInput.nativeElement.value = geneUniquenames.join(',');

      form.nativeElement.submit();
    }
  }

  selectionInProgress() {
    return this.selectedGenes != null;
  }

  startSelection() {
    this.selectedGenes = {};
    this.genes.map(gene => {
      this.selectedGenes![gene.uniquename] = false;
    });
    this.selectedCountCache = 0;
  }

  cancelSelection() {
    this.selectedGenes = undefined;
    this.selectedCountCache = -1;
  }

  selectAll() {
    if (this.selectedGenes) {
      Object.keys(this.selectedGenes).map(geneUniquename => {
        this.selectedGenes![geneUniquename] = true;
      });
      this.selectedCountCache = this.genes.length;
    }
  }

  selectNone() {
    if (this.selectedGenes) {
      Object.keys(this.selectedGenes).map(geneUniquename => {
        this.selectedGenes![geneUniquename] = false;
      });
    }
    this.selectedCountCache = 0;
  }

  selectionChanged() {
    this.selectedCountCache = -1;
  }

  selectedCount() {
    if (this.selectedCountCache === -1) {
      this.selectedCountCache = 0;
      if (this.selectedGenes) {
        Object.keys(this.selectedGenes).map(geneUniquename => {
          if (this.selectedGenes![geneUniquename]) {
            this.selectedCountCache++;
          }
        });
      }
    }

    return this.selectedCountCache;
  }

  queryResultDisplayName(queryResult: QueryResult): string {
    if (queryResult) {
      return queryResult.getQuery().getQueryName() ||
        queryResult.getQuery().toString();
    } else {
      return '[unknown query]';
    }
  }

  private makeGeneListQuery(): GeneQuery {
    if (this.genesOrResults instanceof QueryResult) {
      const queryResult = this.genesOrResults;
      return queryResult.getQuery();
    } else {
      return new GeneQuery(new GeneListNode(this.description, this.genes));
    }
  }

  private makeGeneQueryFromList(genes: Array<{ uniquename: string }>): GeneQuery {
    let newName = undefined;
    if (this.genesOrResults instanceof QueryResult) {
      const queryResults = this.genesOrResults;
      if (queryResults.getQuery().getQueryName()) {
        newName = queryResults.getQuery().getQueryName();
      }
    } else {
      if (this.description) {
        newName = this.description;
      }
    }
    if (newName) {
      if (genes.length > 1) {
        newName = genes.length + ' genes from: ' + newName;
      } else {
        newName = 'gene from: ' + newName;
      }
    }
    return new GeneQuery(new GeneListNode(newName, genes));
  }

  filter() {
    if (!this.selectedGenes) {
      return;
    }

    const selectedGenes =
      this.genes.filter(gene => this.selectedGenes![gene.uniquename]);

    const geneQuery = this.makeGeneQueryFromList(selectedGenes);
    const callback = (historyEntry: HistoryEntry) => {
      this.router.navigate(['/results/from/id/', historyEntry.getEntryId()]);
    };
    this.queryService.runAndSaveToHistory(geneQuery, callback);

    this.selectedGenes = undefined;
    this.selectedCountCache = -1;
  }

  showQuilt(): void {
    const query = this.makeGeneListQuery();
    this.queryRouterSerive.gotoResults(query, 'vis');
  }

  showGeneEx(): void {
    const query = this.makeGeneListQuery();
    this.queryRouterSerive.gotoResults(query, 'gene-ex');
  }

  showResults(): void {
    const query = this.makeGeneListQuery();
    this.queryRouterSerive.gotoResults(query, 'results');
  }

  showSlim(subsetName: string): void {
    const query = this.makeGeneListQuery();
    this.queryRouterSerive.gotoResults(query, 'slim:' + subsetName);
  }

  showingResults(): boolean {
    return this.mode === 'results';
  }

  showingVisualisation(): boolean {
    return this.showingQuilt() || this.showingGeneEx();
  }

  showingQuilt(): boolean {
    return this.mode === 'vis';
  }

  showingGeneEx(): boolean {
    return this.mode === 'gene-ex';
  }

  showingSlim(): boolean {
    return this.mode.startsWith('slim');
  }

  geneExImgSrc(): string {
    return '/api/v1/dataset/latest/gene_ex_violin_plot/large/' +
      this.genes.map(g => g.uniquename).join(',');
  }

  ngOnInit() {
    this.columnsSubscription =
      this.settingsService.visibleGenesTableFieldNames$
        .subscribe(visbleFieldnames => {
          this.visibleFieldNames = visbleFieldnames;

          if (!this.visibleFieldNames.includes(this.orderByFieldName)) {
            if (this.visibleFieldNames.includes('product')) {
              this.setOrderBy('product');
            } else {
              if (this.visibleFieldNames.includes('name')) {
                this.setOrderBy('name');
              } else {
                if (this.visibleFieldNames.includes('uniquename')) {
                  this.setOrderBy('uniquename');
                } else {
                  if (this.visibleFieldNames.length > 0) {
                    this.setOrderBy(this.visibleFieldNames[0]);
                  } else {
                    this.visibleFieldNames.push('uniquename');
                    this.setOrderBy('uniquename');
                  }
                }
              }
            }
          }

          this.visibleFields = [];
          for (const fieldName of visbleFieldnames) {
            const fieldConfig = this.geneResultConfig.field_config[fieldName];
            this.visibleFields.push(fieldConfig);
          }

          this.updateDisplayGenes();
        });
    this.updateDisplayGenes();
  }

  ngOnChanges() {
    this.genes = [];

    if (this.mode.startsWith('slim:')) {
      this.slimName = this.mode.substr(5);
      this.slimDescription = this.appConfig.slims[this.slimName].description;
    } else {
      this.slimName = undefined;
      this.slimDescription = undefined;
    }

    if (this.genesOrResults instanceof QueryResult) {
      this.queryResult = this.genesOrResults;

      this.pombaseApiService.getGeneSummaryMapPromise()
        .then((geneSummaries: GeneSummaryMap) => {
          this.genes =
            this.queryResult.getRows().map((row) => {
              return geneSummaries[row.gene_uniquename];
            });
          this.updateDisplayGenes();
        })
    } else {
      this.genes = this.genesOrResults;
      this.updateDisplayGenes();
    }
  }

  ngOnDestroy(): void {
    this.columnsSubscription.unsubscribe();
  }
}
