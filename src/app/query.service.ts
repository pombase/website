import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { TimerObservable } from 'rxjs/observable/TimerObservable';
import { GeneQuery, QueryResult, QueryOutputOptions, QueryIdNode } from './pombase-query';
import { getAppConfig } from './config';
import { Results } from './query/results';

const localStorageKey = 'pombase-query-build-history-v1';

let historyEntryCounter = 0;

export class HistoryEntry {
  checked = false;
  private updatedCount: number = null;

  // assign internal IDs where they are missing/null
  static internalIdCounter = 1;

  constructor(private id: string, private query: GeneQuery, private resultCount: number,
    private creationStamp: number = null) {
    if (!this.id) {
      this.id = String(HistoryEntry.internalIdCounter++);
    }
  };

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

  constructor(private http: Http) {
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
        timer.subscribe(t => {
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
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this.apiUrl + '/query', jsonString, options).toPromise()
      .then(raw => {
        const rawJson = raw.json();
        if (rawJson.status === 'ok') {
          return new QueryResult(rawJson.id, GeneQuery.fromJSONString(rawJson.query), rawJson.rows);
        } else {
          throw rawJson.err;
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

  execById(id: string, outputOptions?: QueryOutputOptions): Promise<QueryResult> {
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
        const subscription = timer.subscribe(t => {
          this.postQueryCount(query)
            .then((res) => {
              histEntry.setUpdatedCount(res.getRowCount());
              subscription.unsubscribe();
            });
        });
      };
    for (let i = 0; i < this.history.length; i++) {
      countUpdater(this.history[i], i * 100);
    }
  }
}
