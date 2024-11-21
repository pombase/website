import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getAppConfig } from '../config';
import { IdentifierMapperService } from '../identifier-mapper.service';
import { GeneSummary, GeneSummaryMap, PombaseAPIService } from '../pombase-api.service';
import { GeneListNode, GeneQuery, GeneUniquename } from '../pombase-query';
import { QueryRouterService } from '../query-router.service';

@Component({
    selector: 'app-identifier-mapper-results',
    templateUrl: './identifier-mapper-results.component.html',
    styleUrls: ['./identifier-mapper-results.component.css'],
    standalone: false
})
export class IdentifierMapperResultsComponent implements OnInit {
  INITIAL_NOT_FOUND = 10;

  appConfig = getAppConfig();
  organismCommonName = this.appConfig.getConfigOrganism().common_name;

  resultsReady = false;

  private geneSummaryMapPromise: Promise<GeneSummaryMap>;
  geneSummaryMap: GeneSummaryMap;
  private _showAllNotFound: boolean = false;

  private _showAllOneToOne: boolean = false;
  private _showAllOneToMany: boolean = false;
  private _showAllManyToOne: boolean = false;
  private _showAllManyToMany: boolean = false;

  subsetForQueryBuilder: 'all'|'one-to-one'|'one-to-many'|'many-to-one'|'many-to-many' = 'all';

  constructor(private router: Router,
              public identifierMapperService: IdentifierMapperService,
              private pombaseApiService: PombaseAPIService,
              private queryRouterService: QueryRouterService) {
    this.geneSummaryMapPromise = this.pombaseApiService.getGeneSummaryMapPromise();
    this.geneSummaryMapPromise.then(geneSummaryMap => this.geneSummaryMap = geneSummaryMap);

    identifierMapperService.resultsReady()
      .then(() => {
        this.resultsReady = true;
        // show the results if there is only one
        this._showAllOneToOne = (this.oneToOneMatchesCount() == 1);
        this._showAllOneToMany = (this.oneToManyMatchesCount() == 1);
        this._showAllManyToOne = (this.manyToOneMatchesCount() == 1);
        this._showAllManyToMany = (this.manyToManyMatchesCount() == 1);
      });
  }

  backToInput(): void {
    this.router.navigate(['/identifier-mapper']);
  }

  hasMatches(): boolean {
    return this.identifierMapperService.hasMatches();
  }

  revealAllNotFound(): void {
    this._showAllNotFound = true;
  }

  showingAllNotFound(): boolean {
    return this.notFound().length <= this.INITIAL_NOT_FOUND ||
      this._showAllNotFound;
  }

  displayNotFoundList(): Array<string> {
    if (this._showAllNotFound) {
      return this.notFound();
    } else {
      return this.notFound().slice(0, this.INITIAL_NOT_FOUND);
    }
  }

  public objectKeyCount(obj: {}): number {
    return Object.keys(obj).length;
  }

  public notFound(): Array<string> {
    return this.identifierMapperService.notFound();
  }

  public oneToOneMatches(): { [id: string]: GeneSummary } {
    return this.identifierMapperService.oneToOneMatches();
  }

  public oneToOneMatchesCount(): number {
    return this.objectKeyCount(this.oneToOneMatches());
  }

  public hasOneToOneMatches(): boolean {
    return this.identifierMapperService.hasOneToOneMatches();
  }

  public oneToManyMatches(): { [id: string]: Array<GeneSummary> } {
    return this.identifierMapperService.oneToManyMatches();
  }

  public oneToManyMatchesCount(): number {
    return this.objectKeyCount(this.oneToManyMatches());
  }

  public showAllOneToOne(): boolean {
    return this._showAllOneToOne;
  }

  public revealAllOneToOne() {
    this._showAllOneToOne = true;
  }

  public hideAllOneToOne() {
    this._showAllOneToOne = false;
  }

  public hasOneToManyMatches(): boolean {
    return this.identifierMapperService.hasOneToManyMatches();
  }

  public showAllOneToMany(): boolean {
    return this._showAllOneToMany;
  }

  public revealAllOneToMany() {
    this._showAllOneToMany = true;
  }

  public hideAllOneToMany() {
    this._showAllOneToMany = false;
  }

  public manyToOneMatches(): { [id: string]: Array<string> } {
    return this.identifierMapperService.manyToOneMatches();
  }

  public hasManyToOneMatches(): boolean {
    return this.identifierMapperService.hasManyToOneMatches();
  }

  public manyToOneMatchesCount(): number {
    return this.objectKeyCount(this.manyToOneMatches());
  }

  public showAllManyToOne(): boolean {
    return this._showAllManyToOne;
  }

  public revealAllManyToOne() {
    this._showAllManyToOne = true;
  }

  public hideAllManyToOne() {
    this._showAllManyToOne = false;
  }

  public manyToManyMatches(): Array<[Set<string>, Set<GeneSummary>]> {
    return this.identifierMapperService.manyToManyMatches();
  }

  public hasManyToManyMatches(): boolean {
    return this.identifierMapperService.hasManyToManyMatches();
  }

  public manyToManyMatchesCount(): number {
    return this.manyToManyMatches().length;
  }

  public showAllManyToMany(): boolean {
    return this._showAllManyToMany;
  }

  public revealAllManyToMany() {
    this._showAllManyToMany = true;
  }

  public hideAllManyToMany() {
    this._showAllManyToMany = false;
  }

  public allMatchesCount(): number {
    return this.identifierMapperService.allMatchesCount();
  }

  public geneOrGenes(): string {
    if (this.allMatchesCount() == 1) {
      return 'gene';
    } else {
      return 'genes';
    }
  }

  private allMatches(): Array<GeneUniquename> {
    return this.identifierMapperService.allMatches();
  }

  public showSubSetSelector(): boolean {
    let count = 0;
    if (this.hasOneToOneMatches()) {
      count += 1;
    }
    if (this.hasOneToManyMatches()) {
      count += 1;
    }
    if (this.hasManyToOneMatches()) {
      count += 1;
    }
    if (this.hasManyToManyMatches()) {
      count += 1;
    }
    return count > 1;
  }

  public sendToQueryBuilder(): void {
    let genesToSend: Array<GeneUniquename> = [];

    switch (this.subsetForQueryBuilder) {
    case 'all':
      genesToSend = this.allMatches();
      break;
    case 'one-to-one':
      Object.values(this.oneToOneMatches())
        .map((gene) => {
          genesToSend.push(gene.uniquename);
        })
      break;
    case 'one-to-many':
      Object.keys(this.oneToManyMatches())
        .map(key => {
          const matches = this.oneToManyMatches()[key];
          matches.map(geneSumm => genesToSend.push(geneSumm.uniquename));
        });
      break;
    case 'many-to-one':
      Object.keys(this.manyToOneMatches())
        .map(geneUniquename => {
          genesToSend.push(geneUniquename);
        });
      break;
    case 'many-to-many':
      const manyToManyMatches = this.identifierMapperService.manyToManyMatches();
      for (const [_, matches] of manyToManyMatches) {
        matches.forEach(geneSumm => genesToSend.push(geneSumm.uniquename));
      }
      break;
    }

    let queryName;

    if (genesToSend.length == 1) {
      queryName = 'gene';
    } else {
      queryName = genesToSend.length + ' genes';
    }

    queryName += ' from ' + this.identifierMapperService.mapperType.displayName +
      ' identifier mapping';

    const part = new GeneListNode(queryName, genesToSend);
    const geneQuery = new GeneQuery(part);
    this.queryRouterService.gotoResults(geneQuery);
  }

  ngOnInit(): void {
  }
}
