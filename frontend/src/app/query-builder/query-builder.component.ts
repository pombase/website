import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { GeneQuery, GeneQueryNode, QueryResult, TermNode, SubsetNode,
         QueryOutputOptions } from '../pombase-query';
import { QueryService } from '../query.service';
import { TimerObservable } from 'rxjs/observable/TimerObservable';
import { getAppConfig } from '../config';

@Component({
  selector: 'app-query-builder',
  templateUrl: './query-builder.component.html',
  styleUrls: ['./query-builder.component.css']
})
export class QueryBuilderComponent implements OnInit, OnDestroy {
  query: GeneQuery;
  results: QueryResult = null;
  resultsDescription = '';
  timerSubscription = null;
  showLoading = false;
  startNodeType = null;

  resetQuery() {
    this.query = null;
    this.results = null;
    this.resultsDescription = '';
  }

  constructor(private queryService: QueryService,
              private route: ActivatedRoute,
             ) {
    this.resetQuery();
  }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      this.startNodeType = null;
      const goToResults =
        params['saveOrResults'] && params['saveOrResults'] === 'results';
      if (params['predefinedQueryName']) {
        const queryJson = getAppConfig().getPredefinedQuery(params['predefinedQueryName']);
        const query = new GeneQuery(queryJson);
        if (goToResults) {
          this.gotoResults(query);
        } else {
          this.saveQuery(query);
        }
      } else {
        let fromType = params['type'];
        let termId = params['id'];
        let termName = params['name'];
        if (fromType && termId && termName) {
          this.processFromRoute(fromType, termId, termName);
        } else {
          const subsetName = params['subsetName'];
          let subsetDisplayName = params['subsetDisplayName'];
          if (subsetName) {
            let decodedSubsetDisplayName = '';
            if (subsetDisplayName) {
              decodedSubsetDisplayName = decodeURIComponent(subsetDisplayName);
            }
            this.fromSubsetName(goToResults, subsetName, decodedSubsetDisplayName);
          } else {
            const json = params['json'];
            if (json) {
              this.fromJson(goToResults, json);
            } else {
              const nodeTypeId = +params['nodeTypeId'];
              if (nodeTypeId) {
                this.startNodeType = nodeTypeId;
              } else {
                const historyEntryId = +params['historyEntryId'];
                if (historyEntryId) {
                  const query = this.queryService.historyEntryById(historyEntryId);
                  if (query) {
                    this.gotoResults(query);
                  }
                }
              }
            }
          }
        }
      }
    });
  }

  private fromSubsetName(goToResults: boolean,
                         subsetName: string, subsetDisplayName: string): void {
    const constraints = new SubsetNode (subsetName, subsetDisplayName);
    const query = new GeneQuery(constraints);
    if (goToResults) {
      this.gotoResults(query);
    } else {
      this.saveQuery(query);
    }
  }

  private fromJson(goToResults: boolean, json: string) {
    const obj = JSON.parse(json);
    const query = new GeneQuery(obj);
    if (goToResults) {
      this.gotoResults(query);
    } else {
      this.saveQuery(query);
    }
  }

  processFromRoute(fromType: string, termId: string, encodedTermName: string) {
    let newQuery = null;

    if (fromType === 'term_subset') {
      let singleOrMulti = null;
      const matches = termId.match(/^([^:]+):/);
      if (matches && getAppConfig().phenotypeIdPrefixes.indexOf(matches[1]) !== -1) {
        // only set singleOrMulti if the termid is from a phenotype CV
        singleOrMulti = 'single';
      }
      const termName = decodeURIComponent(encodedTermName);
      const constraints = new TermNode(termId, termName, null, singleOrMulti, null);
      newQuery = new GeneQuery(constraints);
    }

    if (newQuery) {
      this.saveQuery(newQuery);
    }
  }

  gotoResults(query: GeneQuery) {
    this.query = query;
    this.results = null;
    this.showLoading = false;
    let timer = TimerObservable.create(400);
    this.timerSubscription = timer.subscribe(t => {
      this.showLoading = true;
    });
    let queryAsString = this.query.toString();

    const thisQuery = this.query;

    const outputOptions = new QueryOutputOptions(['gene_uniquename'], 'none');
    this.queryService.postQuery(this.query, outputOptions)
      .subscribe((results) => {
        this.queryService.saveToHistoryWithCount(thisQuery, results.rows.length);
        this.results = results;
        this.resultsDescription = 'Results for: ' + queryAsString;
        this.timerSubscription.unsubscribe();
        this.timerSubscription = null;
        this.showLoading = false;
      });
  }

  saveQuery(query: GeneQuery) {
    this.queryService.saveToHistory(query);
  }

  nodeEvent(part: GeneQueryNode) {
    if (part) {
      const query = new GeneQuery(part);
      this.saveQuery(query);
    }
  }

  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }
}
