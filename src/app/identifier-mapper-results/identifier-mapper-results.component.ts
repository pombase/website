import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getAppConfig } from '../config';
import { IdentifierMapperService } from '../identifier-mapper.service';
import { GeneSummary, GeneSummaryMap, PombaseAPIService } from '../pombase-api.service';
import { GeneListNode, GeneQuery } from '../pombase-query';
import { QueryRouterService } from '../query-router.service';

@Component({
  selector: 'app-identifier-mapper-results',
  templateUrl: './identifier-mapper-results.component.html',
  styleUrls: ['./identifier-mapper-results.component.css']
})
export class IdentifierMapperResultsComponent implements OnInit {
  INITIAL_NOT_FOUND = 10;

  appConfig = getAppConfig();
  organismCommonName = this.appConfig.getConfigOrganism().common_name;

  private geneSummaryMapPromise: Promise<GeneSummaryMap> = null;
  geneSummaryMap: GeneSummaryMap = null;
  private _showAllNotFound: boolean = false;

  // all currently disabled:
  private _showAllOneToOne: boolean = true;
  private _showAllOneToMany: boolean = true;
  private _showAllManyToMany: boolean = true;


  constructor(private router: Router,
              public identifierMapperService: IdentifierMapperService,
              private pombaseApiService: PombaseAPIService,
              private queryRouterService: QueryRouterService) {
    this.geneSummaryMapPromise = this.pombaseApiService.getGeneSummaryMapPromise();
    this.geneSummaryMapPromise.then(geneSummaryMap => this.geneSummaryMap = geneSummaryMap)
  }

  backToInput(): void {
    this.router.navigate(['/identifier-mapper']);
  }

  hasMatches(): boolean {
    return this.identifierMapperService.hasMatches();
  }

  reveilAllNotFound(): void {
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

  public hasOneToOneMatches(): boolean {
    return this.identifierMapperService.hasOneToOneMatches();
  }

  public oneToManyMatches(): { [id: string]: Array<GeneSummary> } {
    return this.identifierMapperService.oneToManyMatches();
  }

  public showAllOneToOne(): boolean {
    return this._showAllOneToOne;
  }

  public reveilAllOneToOne() {
    this._showAllOneToOne = true;
  }

  public hasOneToManyMatches(): boolean {
    return this.identifierMapperService.hasOneToManyMatches();
  }

  public showAllOneToMany(): boolean {
    return this._showAllOneToMany;
  }

  public reveilAllOneToMany() {
    this._showAllOneToMany = true;
  }

  public manyToOneMatches(): { [id: string]: Array<string> } {
    return this.identifierMapperService.manyToOneMatches();
  }

  public hasManyToOneMatches(): boolean {
    return this.identifierMapperService.hasManyToOneMatches();
  }

  public showAllManyToMany(): boolean {
    return this._showAllManyToMany;
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

  public sendToQueryBuilder(): void {
    this.identifierMapperService.allMatches()
      .then((genes: Array<GeneSummary>) => {
        let queryName;

        if (genes.length == 1) {
          queryName = 'gene';
        } else {
          queryName = genes.length + ' genes';
        }

        queryName += ' from ' + this.identifierMapperService.mapperType.displayName +
          ' identifier mapping';

        const part = new GeneListNode(queryName, genes);
        const geneQuery = new GeneQuery(part);
        this.queryRouterService.gotoResults(geneQuery);
      });
  }

  ngOnInit(): void {
  }
}
