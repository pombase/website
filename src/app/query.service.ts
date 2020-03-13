import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject, BehaviorSubject } from 'rxjs';
import { TimerObservable } from 'rxjs/observable/TimerObservable';
import { GeneQuery, QueryResult, QueryOutputOptions, QueryIdNode, GeneUniquename } from './pombase-query';
import { getAppConfig } from './config';
import { PombaseAPIService, GeneSummaryMap, GeneSummary } from './pombase-api.service';

export interface DisplayResultRow {
  uniquename: string;
  [fieldName: string]: any;
}

const localStorageKey = 'pombase-query-build-history-v1';

const QUERY_CACHE_MAX = 20;

export class HistoryEntry {

  // assign internal IDs where they are missing/null
  static internalIdCounter = 1;
  checked = false;
  private updatedCount: number = null;

  constructor(private id: string, private query: GeneQuery, private resultCount: number,
    private creationStamp: number = null) {
    if (!this.id) {
      this.id = String(HistoryEntry.internalIdCounter++);
    }
  }

  isNewEntry(): boolean {
    return this.creationStamp != null &&
      (new Date().getTime() - this.creationStamp) / 1000 < 2;
  }

  getQuery(): GeneQuery {
    return this.query;
  }

  getResultCount(): number {
    if (this.resultCount === undefined || this.resultCount === null) {
      return null;
    } else {
      return this.resultCount;
    }
  }

  toObject(): Object {
    let o = this.query.toObject();
    o.id = this.getEntryId();
    o.resultCount = this.getResultCount();
    return o;
  }

  setUpdatedCount(updatedCount: number) {
    if (this.resultCount !== updatedCount) {
      this.updatedCount = updatedCount;
    }
  }

  getUpdatedCount(): number {
    return this.updatedCount;
  }

  getEntryId(): string {
    return this.id;
  }
}

@Injectable()
export class QueryService {
  private apiUrl = '/api/v1/dataset/latest';

  private history: Array<HistoryEntry> = [];
  private subject: BehaviorSubject<Array<HistoryEntry>> = null;

  private queryCache: Array<QueryResult> = [];

  constructor(private pombaseApiService: PombaseAPIService,
              private http: HttpClient) {
    try {
      let savedHistoryString = localStorage.getItem(localStorageKey);
      if (savedHistoryString) {
        this.history = [];

        for (let o of JSON.parse(savedHistoryString)) {
          try {
            let id = o.id;
            const query = GeneQuery.fromJSONString(o);
            const entry = new HistoryEntry(id, query, o.resultCount);
            this.history.push(entry);
          } catch (e) {
            console.log('failed to deserialise: ' + JSON.stringify(o) + ' - ' + e.message);
          }
        };

        let timer = TimerObservable.create(0.2);
        timer.subscribe(() => {
          this.setAllCounts();
        });
      }
      this.subject = new BehaviorSubject(this.history);
    } catch (e) {
      console.log('failed to deserialise history: ' + e.message);
    }
  }

  private postRaw(query: GeneQuery, outputOptions: QueryOutputOptions): Promise<QueryResult> {
    const jsonString = query.toPostJSON(outputOptions);
    const headers = new HttpHeaders().append('Content-Type', 'application/json');
    return this.http.post<QueryResult>(this.apiUrl + '/query', jsonString, { headers }).toPromise()
      .then((json: any) => {
        if (json['status'] === 'ok') {
          return new QueryResult(json['id'], GeneQuery.fromJSONString(json['query']), json['rows']);
        } else {
          return Promise.reject(json['status']);
        }
      });
  }

  postQuery(query: GeneQuery, outputOptions: QueryOutputOptions = new QueryOutputOptions([], [], 'none')): Promise<QueryResult> {
    return this.postRaw(query, outputOptions);
  }
  postQueryCount(query: GeneQuery): Promise<QueryResult> {
    const outputOptions = new QueryOutputOptions([], [], 'none');
    return this.postRaw(query, outputOptions);
  }

  postPredefinedQuery(queryName: string, name: string, outputOptions: QueryOutputOptions): Promise<QueryResult> {
    const query = GeneQuery.fromJSONString(getAppConfig().getPredefinedQuery(queryName));
    query.setName(name);
    return this.postQuery(query, outputOptions);
  }

  postPredefinedQueryCount(queryName: string): Promise<QueryResult> {
    const query = GeneQuery.fromJSONString(getAppConfig().getPredefinedQuery(queryName));
    return this.postQueryCount(query);
  }

  private saveHistory() {
    let historyObjects = this.history.map((e) => e.toObject());
    localStorage.setItem(localStorageKey, JSON.stringify(historyObjects));
  }

  historyEntryById(historyEntryId: string): GeneQuery {
    for (let entry of this.history) {
      if (entry.getEntryId() === historyEntryId) {
        return entry.getQuery();
      }
    }
    return null;
  }

  private deleteExisting(query: GeneQuery) {
    this.history = this.history.filter(histEntry => {
      return !histEntry.getQuery().equals(query);
    });
  }

  saveResultsToHistory(result: QueryResult): HistoryEntry {
    this.addToResultCache(result);
    const query = result.getQuery();
    this.deleteExisting(query);
    const entry = new HistoryEntry(result.getId(), query, result.getRowCount(),
                                   new Date().getTime());
    this.history.unshift(entry);
    this.subject.next(this.history);
    this.saveHistory();
    return entry;
  }

  runAndSaveToHistory(query: GeneQuery,
    doneCallback?: (historyEntry: HistoryEntry) => void) {
    this.postQueryCount(query)
      .then((result) => {
        const historyEntry = this.saveResultsToHistory(result);
        if (doneCallback) {
          doneCallback(historyEntry);
        }
      });
  }

  exec(query: GeneQuery, outputOptions?: QueryOutputOptions): Promise<QueryResult> {
    return this.postQuery(query, outputOptions)
      .then((result: QueryResult) => {
        this.saveResultsToHistory(result);
        return result;
      });
  }

  getFromCache(id: string): QueryResult {
   for (const cachedQueryResult of this.queryCache) {
     if (id === cachedQueryResult.getId()) {
       return cachedQueryResult;
     }
   }
   return null;
  }

  addToResultCache(queryResult: QueryResult): void {
    if (this.getFromCache(queryResult.getId()) !== null) {
      return;
    }
    if (this.queryCache.length > QUERY_CACHE_MAX) {
      this.queryCache.shift();
    }
    this.queryCache.push(queryResult);
  }

  execById(id: string, outputOptions?: QueryOutputOptions): Promise<QueryResult> {
    const cachedQueryResult = this.getFromCache(id);
    if (cachedQueryResult) {
      this.saveResultsToHistory(cachedQueryResult)
      return Promise.resolve(cachedQueryResult);
    }
    let query = this.historyEntryById(id);
    if (!query) {
      query = new GeneQuery(null, new QueryIdNode(id));
    }
    return this.postQuery(query, outputOptions)
      .then((result: QueryResult) => {
        this.saveResultsToHistory(result);
        return result;
      });
  }

  queryGenesWithFields(geneUniquenames: Array<GeneUniquename>,
                       fieldNames: Array<string>): Promise<Array<DisplayResultRow>>
  {
     return this.pombaseApiService.getGeneSummaryMapPromise()
      .then(
        (geneSummaryMap: GeneSummaryMap) =>
          geneUniquenames.map(geneUniquename => {
            const geneSummary = geneSummaryMap[geneUniquename];
            const displayRow: any = { };

            displayRow['uniquename'] = geneSummary.uniquename;

            for (const fieldName of fieldNames) {
              displayRow[fieldName] = geneSummary.getFieldDisplayValue(fieldName);
            }

            return displayRow as DisplayResultRow;
          })
      );
  }

  getHistory(): Array<HistoryEntry> {
    return this.history;
  }

  getHistoryChanges(): Subject<Array<HistoryEntry>> {
    return this.subject;
  }

  removeFromHistory(...entries: Array<HistoryEntry>) {
    let removeQueries = entries.map(e => e.getQuery());
    this.history =
      this.history.filter((entry: HistoryEntry) => {
        return removeQueries.indexOf(entry.getQuery()) === -1;
      });
    this.subject.next(this.history);
    this.saveHistory();
  }

  setAllCounts() {
    const countUpdater =
      (histEntry: HistoryEntry, delay: number) => {
        const query = histEntry.getQuery();

        let timer = TimerObservable.create(delay);
        const subscription = timer.subscribe(() => {
          this.postQueryCount(query)
            .then((res) => {
              histEntry.setUpdatedCount(res.getRowCount());
              subscription.unsubscribe();
            });
        });
      };
    for (let i = 0; i < this.history.length; i++) {
      let delay;
      if (i < 10) {
        delay = i * 200;
      } else {
        delay = (i - 10) * 500 + 2500;
      }
      countUpdater(this.history[i], delay);
    }
  }
}
