import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { PombaseAPIService, GeneSummary, IdNameAndOrganism } from '../pombase-api.service';
import { CompleteService, SolrTermSummary, SolrRefSummary, SolrAlleleSummary } from '../complete.service';
import { getAppConfig, ConfigOrganism } from '../config';

import { TypeaheadMatch } from 'ngx-bootstrap/typeahead/typeahead-match.class';
import { switchMap } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { DeployConfigService } from '../deploy-config.service';
import { Util } from '../shared/util';

class SearchSummary {
  constructor(
    public uniquename: string,
    public uniquenameLowerCase: string,
    public name: string|undefined,
    public nameLowerCase: string|undefined,
    public product: string|undefined,
    public productLowerCase: string|undefined,
    public uniprotIdentifier: string|undefined,
    public uniprotIdentifierLowerCase: string|undefined,
    public transcripts: Array<string>,
    public lowerCaseTranscripts: Array<string>,
    public synonyms: Array<string>,
    public synonymsLowerCase: Array<string>,
    public orthologs: Array<IdNameAndOrganism>,
    public organism: ConfigOrganism) { }
}

class DisplayModel {
  constructor(public matchType: string,
              public uniquename: string,
              public name: string|undefined,
              public otherDetails: Array<string>,
              public alleleGeneUniquename?: string,
              public organism?: ConfigOrganism) {
    if (this.name && this.name.length > 45) {
      this.name = this.name.slice(0, 42) + '...';
    }
    if (this.otherDetails) {
      this.otherDetails =
        this.otherDetails.filter(detail => detail && detail.length > 0);
      for (let idx = 0; idx < this.otherDetails.length; idx++) {
        const otherDetail = this.otherDetails[idx];
        if (otherDetail.length > 73 && otherDetail.indexOf('<span') === -1) {
          this.otherDetails[idx] = otherDetail.slice(0, 70) + '...';
        }
      }
    }
  }
}

interface FieldAndOrth {
  matchingFieldValue: string;
  orth: IdNameAndOrganism;
}

@Component({
    selector: 'app-search-box',
    templateUrl: './search-box.component.html',
    styleUrls: ['./search-box.component.css'],
    standalone: false
})
export class SearchBoxComponent implements OnInit {
  dataSource: Observable<Array<DisplayModel>>;
  noResults = false;
  waitingForServer = false;

  fieldValue = '';

  geneSummariesFailed = false;

  searchSummaries: Array<SearchSummary> = [];

  appConfig = getAppConfig();

  configuredTaxonIds = this.appConfig.organisms.map(org => org.taxonid);

  cvNamesForTermComplete = '(' + this.appConfig.searchBoxCvNames.join(' OR ') + ')';

  sysGeneIdRe = new RegExp(this.appConfig.gene_systematic_identifier_re);
  sysTranscriptIdRe = new RegExp(this.appConfig.transcript_systematic_identifier_re);

  @ViewChild('searchBox') searchBoxElement: ElementRef;

  constructor(private completeService: CompleteService,
              private pombaseApiService: PombaseAPIService,
              private deployConfigService: DeployConfigService,
              private router: Router) {
  }

  isInitialised(): boolean {
    return this.searchSummaries.length > 0;
  }

  private makeGeneDisplayModel(uniquename: string, name: string|undefined, otherDetailsArg: Array<string>,
                               organism: ConfigOrganism): DisplayModel {
    let otherDetails: Array<string> = [...otherDetailsArg];
    if (getAppConfig().isMultiOrganismMode()) {
      const orgDetails =
        `<span class="search-box-organism">${organism.common_name}</span>`;
      otherDetails.unshift(orgDetails);
    }

    return new DisplayModel('Matching genes:', uniquename, name, otherDetails, undefined, organism);
  }

  private highlightMatch(pos: number, searchString: string, target?: string): string {
    let start;
    let highlightBit;
    let rest;
    if (target) {
      start = target.substr(0, pos);
      highlightBit = target.substr(pos, searchString.length);
      rest = target.substr(pos + searchString.length);
    } else {
      start = '';
      highlightBit = searchString;
      rest = '';
    }
    return `${start}<span class="search-box-highlight">${highlightBit}</span>${rest}`;
  }

  private makeTermDisplayModel(termResult: SolrTermSummary): DisplayModel {
    let details = termResult.definition;

    if (termResult.highlighting && termResult.highlighting['definition']) {
      details = termResult.highlighting['definition'];
    }
    return new DisplayModel('Matching terms:', termResult.termid, termResult.name,
                            [details]);
  }

  private makeRefDisplayModel(refResult: SolrRefSummary): DisplayModel {
    let authorsAbbrev = refResult.authors_abbrev;
    let citation = refResult.citation;

    if (refResult.highlighting) {
      if (refResult.highlighting['authors_abbrev']) {
        authorsAbbrev = refResult.highlighting['authors_abbrev']
      }
      if (refResult.highlighting['citation']) {
        citation = refResult.highlighting['citation'];
      }
    }

    const authorAndCitation =
      [authorsAbbrev, citation].filter(v => !!v).join(' ');

    return new DisplayModel('Matching publications:', refResult.pubmedid, refResult.title,
                            [authorAndCitation]);
  }

  private makeAlleleDisplayModel(alleleResult: SolrAlleleSummary): DisplayModel {
    let nameAndDescription = Util.alleleDisplayName(alleleResult);

    let geneDisplayName = 'Gene: ';
    if (alleleResult.gene_name) {
      geneDisplayName += alleleResult.gene_name;
    } else {
      geneDisplayName += alleleResult.gene_uniquename;
    }

    let otherDetails = [geneDisplayName];

    let fieldValue = this.fieldValue.trim().replace('Δ', 'delta').toLowerCase();

    if (this.fieldValue && alleleResult.synonyms &&
        alleleResult.synonyms.find(syn => syn.toLowerCase() === fieldValue)) {
      otherDetails.push("Matching synonym: " + this.fieldValue);
    }

    return new DisplayModel('Matching alleles:', alleleResult.id, nameAndDescription,
                            otherDetails, alleleResult.gene_uniquename);
  }

  private nameExactMatch(geneSumm: SearchSummary, value: string): DisplayModel|undefined {
    if (geneSumm.nameLowerCase === value) {
      const matchingOrthologs = this.findMatchingOrthologs(geneSumm, value, 'exact');

      const orthOrgsToShow = this.appConfig.searchBoxConfig.ortholog_organisms_to_always_show;

      const details: Array<string> =
        matchingOrthologs.
          filter(orthMatch => orthOrgsToShow.includes(orthMatch.orth.taxonid)).
          map(({ matchingFieldValue, orth }) =>
               this.formatOrthologDetails(orth, matchingFieldValue));
      return this.makeGeneDisplayModel(geneSumm.uniquename, geneSumm.name, details, geneSumm.organism);
    }
    return undefined;
  }

  private identifierExactMatch(geneSumm: SearchSummary, value: string): DisplayModel|undefined {
    if (geneSumm.uniquenameLowerCase === value) {
      return this.makeGeneDisplayModel(geneSumm.uniquename, geneSumm.name, [], geneSumm.organism);
    } else {
      return undefined;
    }
  }

  private nameMatch(geneSumm: SearchSummary, value: string): DisplayModel|undefined {
    if (geneSumm.nameLowerCase && geneSumm.nameLowerCase.indexOf(value) !== -1 &&
        (geneSumm.name!.indexOf('-antisense-') === -1 ||
         value.indexOf('antisense') !== -1)) { // See #409
        return this.makeGeneDisplayModel(geneSumm.uniquename, geneSumm.name, [], geneSumm.organism);
    } else {
      return undefined;
    }
  }

  private identifierMatch(geneSumm: SearchSummary, value: string): DisplayModel|undefined {
    if (geneSumm.uniquenameLowerCase.indexOf(value) !== -1) {
      return this.makeGeneDisplayModel(geneSumm.uniquename, geneSumm.name, [], geneSumm.organism);
    } else {
      return undefined;
    }
  }

  private antisenseNameMatch(geneSumm: SearchSummary, value: string): DisplayModel|undefined {
    if (geneSumm.nameLowerCase && geneSumm.nameLowerCase.indexOf(value) !== -1 &&
        geneSumm.name!.indexOf('-antisense-') !== -1 &&
        value.indexOf('antisense') === -1) { // See #409
        return this.makeGeneDisplayModel(geneSumm.uniquename, geneSumm.name, [], geneSumm.organism);
    } else {
      return undefined;
    }
  }

  private transcriptMatch(geneSumm: SearchSummary, value: string): DisplayModel|undefined {
    const matchIndex = geneSumm.lowerCaseTranscripts.findIndex(id => id === value);
    if (matchIndex !== -1) {
      const highlightedMatch = this.highlightMatch(0, geneSumm.transcripts[matchIndex]);
      return this.makeGeneDisplayModel(geneSumm.uniquename, geneSumm.name,
                                       ['transcript: ' + highlightedMatch],
                                       geneSumm.organism);
    }
    return undefined;
  }

  private synonymMatch(geneSumm: SearchSummary, value: string): DisplayModel|undefined {
    const matchIndex = geneSumm.synonymsLowerCase.findIndex(syn => syn.indexOf(value) !== -1);
    if (matchIndex !== -1) {
      const highlightedMatch = this.highlightMatch(0, geneSumm.synonyms[matchIndex]);
      return this.makeGeneDisplayModel(geneSumm.uniquename, geneSumm.name,
                                       ['synonym: ' + highlightedMatch],
                                       geneSumm.organism);
    }
    return undefined;
  }

  private synonymExactMatch(geneSumm: SearchSummary, value: string): DisplayModel|undefined {
    const matchIndex = geneSumm.synonymsLowerCase.findIndex(syn => syn === value);
    if (matchIndex !== -1) {
      const highlightedMatch = this.highlightMatch(0, geneSumm.synonyms[matchIndex]);
      return this.makeGeneDisplayModel(geneSumm.uniquename, geneSumm.name,
                                       ['synonym: ' + highlightedMatch],
                                       geneSumm.organism);
    }
    return undefined;
  }


  private findMatchingOrthologs(geneSumm: SearchSummary, value: string, exactness: 'exact' | 'sub-string'): Array<FieldAndOrth> {

    let matchingOrthologs  = [];

    if (exactness === 'exact') {
      for (const orth of geneSumm.orthologs) {
        if (!this.configuredTaxonIds.includes(orth.taxonid)) {
          continue;
        }
        if (orth.name && orth.name.toLowerCase() === value) {
          matchingOrthologs.push({ matchingFieldValue: orth.name, orth });
        } else {
          if (orth.identifier.toLowerCase() === value) {
            matchingOrthologs.push({ matchingFieldValue: orth.identifier, orth });
          } else {
            if (orth.secondary_identifier &&
              orth.secondary_identifier.toLowerCase() === value) {
              matchingOrthologs.push({ matchingFieldValue: orth.secondary_identifier, orth });
            }
          }
        }
      }
    } else {
      for (const orth of geneSumm.orthologs) {
        if (!this.configuredTaxonIds.includes(orth.taxonid)) {
          continue;
        }
        if (orth.name && orth.name.toLowerCase().indexOf(value) !== -1) {
          matchingOrthologs.push({ matchingFieldValue: orth.name, orth });
          break;
        }
      }
    }

    return matchingOrthologs;
  }

  private orthologMatch(geneSumm: SearchSummary, value: string, exactness: 'exact'|'sub-string'): DisplayModel|undefined {

    let matchingOrthologs = this.findMatchingOrthologs(geneSumm, value, exactness);

    if (matchingOrthologs.length > 0) {
      const details =
        matchingOrthologs.map(({ matchingFieldValue, orth })  => {
          return this.formatOrthologDetails(orth, matchingFieldValue);
        });
      return this.makeGeneDisplayModel(geneSumm.uniquename, geneSumm.name,
        details, geneSumm.organism);
    }

    return undefined;
  }

  private formatOrthologDetails(orth: IdNameAndOrganism, matchingFieldValue: string) {
    const orgDetails = this.appConfig.getOrganismByTaxonid(orth.taxonid);
    const commonNameSpan = `<span class="search-box-organism">(${orgDetails.common_name})</span>`;
    return `ortholog: ${this.highlightMatch(0, matchingFieldValue)} ${commonNameSpan}`;
  }

  private productMatch(geneSumm: SearchSummary, value: string): DisplayModel|undefined {
    if (geneSumm.product) {
      const pos = geneSumm.productLowerCase!.indexOf(value);
      if (pos !== -1) {
        const highlightedMatch = this.highlightMatch(pos, value, geneSumm.product);
        return this.makeGeneDisplayModel(geneSumm.uniquename, geneSumm.name,
                                         ['product: ' + highlightedMatch],
                                         geneSumm.organism);
      }
    }
    return undefined;
  }

  private uniprotIdMatch(geneSumm: SearchSummary, value: string): DisplayModel|undefined {
    if (geneSumm.uniprotIdentifier) {
      const pos = geneSumm.uniprotIdentifierLowerCase!.indexOf(value);

      if (pos !== -1) {
        const highlightedMatch = this.highlightMatch(pos, value, geneSumm.uniprotIdentifier);
        return this.makeGeneDisplayModel(geneSumm.uniquename, geneSumm.name,
                                         ['UniProt ID: ' + highlightedMatch],
                                         geneSumm.organism);
      }
    }
    return undefined;
  }

  private containsMatch(matches: Array<DisplayModel>, match: DisplayModel): boolean {
    return matches.findIndex((element) => element.uniquename === match.uniquename) !== -1;
  }

  private summariesFromToken(fieldValue: string): Array<DisplayModel> {
    if (this.searchSummaries) {
      let value = fieldValue.trim().toLowerCase();

      value = value.replace(/\s+gene$/i, '');
      value = value.replace(/^gene\s+/i, '');

      if (value.length > 0) {
        let filteredSummaries: Array<DisplayModel> = [];

        const maybeAdd = (match?: DisplayModel) => {
          if (match && filteredSummaries.length < 20 &&
              !this.containsMatch(filteredSummaries, match)) {
            filteredSummaries.push(match);
          }
        };

        for (let geneSumm of this.searchSummaries) {
          maybeAdd(this.nameExactMatch(geneSumm, value));
        }
        for (let geneSumm of this.searchSummaries) {
          maybeAdd(this.identifierExactMatch(geneSumm, value));
        }
        for (let geneSumm of this.searchSummaries) {
          maybeAdd(this.synonymExactMatch(geneSumm, value));
        }
        for (let geneSumm of this.searchSummaries) {
          maybeAdd(this.orthologMatch(geneSumm, value, 'exact'));
        }
        for (let geneSumm of this.searchSummaries) {
          maybeAdd(this.nameMatch(geneSumm, value));
        }
        if (filteredSummaries.length < 20) {
          let valueNoSuffixes = value;
          const suffixesToTrim = this.appConfig.searchBoxConfig.suffixes_to_trim;
          if (suffixesToTrim) {
            suffixesToTrim.map(suff => {
              valueNoSuffixes = valueNoSuffixes.replace(new RegExp(suff + '$'), '');
            });
          }
          for (let geneSumm of this.searchSummaries) {
            maybeAdd(this.identifierMatch(geneSumm, valueNoSuffixes));
          }
        }
        for (let geneSumm of this.searchSummaries) {
          maybeAdd(this.antisenseNameMatch(geneSumm, value));
        }
        if (filteredSummaries.length < 20) {
          for (let geneSumm of this.searchSummaries) {
            maybeAdd(this.transcriptMatch(geneSumm, value));
          }
        }
        if (filteredSummaries.length < 20) {
          for (let geneSumm of this.searchSummaries) {
            maybeAdd(this.synonymMatch(geneSumm, value));
          }
        }
        if (filteredSummaries.length < 20) {
          for (let geneSumm of this.searchSummaries) {
            maybeAdd(this.orthologMatch(geneSumm, value, 'sub-string'));
          }
        }
        if (filteredSummaries.length < 20) {
          for (let geneSumm of this.searchSummaries) {
            maybeAdd(this.productMatch(geneSumm, value));
          }
        }
        if (filteredSummaries.length < 20) {
          for (let geneSumm of this.searchSummaries) {
            maybeAdd(this.uniprotIdMatch(geneSumm, value));
          }
        }
        return filteredSummaries;
      }
    }
    return [];
  }

  getTermMatches(token: string): Observable<Array<DisplayModel>> {
    return this.completeService.completeTermName(this.cvNamesForTermComplete, token)
      .pipe(map((termResults: Array<SolrTermSummary>) =>
           termResults.map(termResult => this.makeTermDisplayModel(termResult))),
            catchError(e => {
              console.log('completion API call failed: ' + e.message);
              return of([]);
            }));
  }

  getRefMatches(token: string): Observable<Array<DisplayModel>> {
    return this.completeService.completeRef(token)
      .pipe(map((refResults: Array<SolrRefSummary>) =>
           refResults.map(refResult => this.makeRefDisplayModel(refResult))),
            catchError(e => {
              console.log('completion API call failed: ' + e.message);
              return of([]);
            }));
  }

  getAlleleMatches(token: string): Observable<Array<DisplayModel>> {
    token = token.replace('Δ', 'delta');
    return this.completeService.completeAllele(token)
      .pipe(
        map((alleleResults: Array<SolrAlleleSummary>) => {
          const trimToken = token.trim().toLowerCase();
          const nameMatches =
            alleleResults.filter(alleleSummary => {
              if (alleleSummary.name &&
                  alleleSummary.name.toLowerCase() === trimToken) {
                    return true;
              } else {
                if (alleleSummary.synonyms &&
                    alleleSummary.synonyms.find(syn => syn.toLowerCase() === trimToken)) {
                  return true;
                }
              }
              return false;
            });
          if (nameMatches.length > 0) {
            alleleResults = nameMatches;
          }
          return alleleResults.map(alleleResult => this.makeAlleleDisplayModel(alleleResult));
        }),
        catchError(e => {
          console.log('completion API call failed: ' + e.message);
          return of([]);
        }));
  }

  observableFromToken(token: string): Observable<Array<DisplayModel>> {
    token = token.trim();
    let observables = [];
    const geneSummaryObservable = of(this.summariesFromToken(token));
    observables.push(geneSummaryObservable);

    token = token.replace(this.sysGeneIdRe, '').replace(this.sysTranscriptIdRe, '').trim();

    // handle copy and paste from PubMed pages, and other weird things that happen to PMIDs
    token = token.replace(/^(PMID|PubMed)[: _\-]*/i, 'PMID:');

    if (token.length > 0) {
      // for now we filter out systematic IDs because they cause Lucene problems
      const termResultsObservable = this.getTermMatches(token);
      const refResultsObservable = this.getRefMatches(token);

      observables.push(termResultsObservable);
      observables.push(refResultsObservable);

      if (!this.deployConfigService.productionMode()) {
        const alleleResultsObservable = this.getAlleleMatches(token);
        observables.push(alleleResultsObservable);
      }
    }

    const combined =
      combineLatest(observables)
        .pipe(
          map(([geneRes, termRes, refRes, alleleRes]) => {
            const maxGenes = 8;
            const maxTerms = 6;
            const geneCount = geneRes.length;

            if (!termRes) {
              termRes = [];
            }
            if (!refRes) {
              refRes = [];
            }
            if (!alleleRes) {
              alleleRes = [];
            }

            const termCount = termRes.length;
            let refCount = 5;
            if (geneCount + termCount < maxGenes + maxTerms) {
              refCount += (maxGenes + maxTerms) - (geneCount + termCount);
            }

            let maxAlleles = 0;
            if (geneCount == 0) {
              maxAlleles = 5;
            }

            this.waitingForServer = false;

            if (this.deployConfigService.productionMode()) {
              return [...geneRes.slice(0, maxGenes),
                      ...termRes.slice(0, maxTerms),
                      ...refRes.slice(0, refCount)];
            } else {
              return [...geneRes.slice(0, maxGenes),
                      ...alleleRes.slice(0, maxAlleles),
                      ...termRes.slice(0, maxTerms),
                      ...refRes.slice(0, refCount)];
             }
          }));
    return combined;
  }

  getDataSource(): Observable<Array<DisplayModel>> {
    return Observable
      .create((observer: any) => {
        // Runs on every search
        observer.next(this.fieldValue);
      })
      .pipe(
        catchError(err => {
          this.waitingForServer = false;
          return of([]);
        }),
        switchMap((token: string) => {
          this.waitingForServer = true;
          return this.observableFromToken(token);
        })
      );
  }

  ngOnInit() {
    this.dataSource = this.getDataSource();

    this.pombaseApiService.getGeneSummariesPromise()
      .then(summaries => {
        this.searchSummaries = this.makeSearchSummaries(summaries);

        let summaryCmp =
          (a: SearchSummary, b: SearchSummary) => {
            if (a.name) {
              if (b.name) {
                return a.name.localeCompare(b.name);
              } else {
                return -1;
              }
            } else {
              if (b.name) {
                return 1;
              } else {
                return a.uniquename.localeCompare(b.uniquename);
              }
            }
          };

        this.searchSummaries.sort(summaryCmp);

        setTimeout(() => { // this will make the execution after the above boolean has changed
          this.searchBoxElement.nativeElement.focus();
        }, 100);
      })
      .catch(reason => this.geneSummariesFailed = true);
  }

  makeSearchSummaries(summaries: Array<GeneSummary>): Array<SearchSummary> {
    return summaries
      .map(geneSumm => {
        const nameLowerCase =
          geneSumm.name ? geneSumm.name.toLowerCase() : undefined;
        const productLowerCase =
          geneSumm.product ? geneSumm.product.toLowerCase() : undefined;
        const uniprotIdentifierLowerCase =
          geneSumm.uniprot_identifier ? geneSumm.uniprot_identifier.toLowerCase() : undefined;

        let transcripts = [];
        let lowerCaseTranscripts = [];

        for (let transcriptNum = 1;
             transcriptNum <= geneSumm.getTranscriptCount();
             transcriptNum++) {
          const transcriptId = geneSumm.uniquename + '.' + transcriptNum;
          transcripts.push(transcriptId);
          lowerCaseTranscripts.push(transcriptId.toLowerCase());
        }

        return new SearchSummary(geneSumm.uniquename,
                                 geneSumm.uniquename.toLowerCase(),
                                 geneSumm.name, nameLowerCase,
                                 geneSumm.product, productLowerCase,
                                 geneSumm.uniprot_identifier, uniprotIdentifierLowerCase,
                                 transcripts, lowerCaseTranscripts,
                                 geneSumm.synonyms, geneSumm.synonyms.map(syn => syn.toLowerCase()),
                                 geneSumm.orthologs, geneSumm.organism)
      });
  }

  public typeaheadOnSelect(e: TypeaheadMatch): void {
    const displayModel = e.item as DisplayModel;
    if (displayModel.matchType.toLowerCase().includes('gene')) {
      this.router.navigate(['/gene', displayModel.uniquename]);
    } else {
      if (e.item.matchType.toLowerCase().includes('term')) {
        this.router.navigate(['/term', displayModel.uniquename]);
      } else {
        if (e.item.matchType.toLowerCase().includes('publication')) {
          this.router.navigate(['/reference', displayModel.uniquename]);
        } else {
          if (this.deployConfigService.productionMode()) {
            this.router.navigate(['/gene', displayModel.alleleGeneUniquename]);
          } else {
            this.router.navigate(['/allele', displayModel.uniquename]);
          }
        }
      }
    }
    this.clearBox();
  }

  public typeaheadNoResults(e: boolean) {
    this.noResults = e;
  }

  matchesReference(value: string): boolean {
    return value.match(/^\s*(?:(?:pmid|pubmed|go_ref)(?:[:_]| +))?\d\d\d+\s*$/i) != null;
  }

  matchesTerm(value: string): boolean {
    return value.match(/^\s*[a-zA-Z_]+:\d\d\d+\s*$/) != null;
  }

  matchesGoCamId(value: string): boolean {
    return value.match(/^(?:gomodel:)?[0-9a-f]{16}$/) != null;
  }

  clearBox(): void {
    this.fieldValue = '';
  }

  enterPressed() {
    let trimmedValue = this.fieldValue
        .replace(/\s+$/, '').replace(/^\s+/, '');

    if (this.matchesReference(trimmedValue)) {
      let pmid = trimmedValue.replace(/^(?:pmid|pubmed)(?:[:_]| +)/i, 'PMID:');
      if (!pmid.startsWith('PMID:')) {
        pmid = 'PMID:' + pmid;
      }
      this.clearBox()
      this.router.navigate(['/reference', pmid]);
    } else {
      if (this.matchesTerm(trimmedValue)) {
        this.clearBox()
        this.router.navigate(['/term', trimmedValue]);
      } else {
        if (this.matchesGoCamId(trimmedValue)) {
          const gocamDetailPromise = this.pombaseApiService.getGoCamDetailByIds(trimmedValue);
          gocamDetailPromise.then((_) => {
            this.clearBox();
            this.router.navigate(['/gocam/view/docs/', trimmedValue]);
          });
        }
      }
    }
  }

  noMatches(): boolean {
    return !this.waitingForServer && this.noResults && this.fieldValue.length > 0;
  }
}
