import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable, Subject } from 'rxjs';
import { TimerObservable } from 'rxjs/observable/TimerObservable';
import { GeneQuery, QueryResult, QueryOutputOptions } from './pombase-query';
import { getAppConfig } from './config';

function makeResults(query: GeneQuery, resultsObject: any): QueryResult {
  return new QueryResult('OK', query, resultsObject.rows);
}

const localStorageKey = 'pombase-query-build-history-v1';

let historyEntryCounter = 0;

export class HistoryEntry {
  checked = false;
  private id: number;
  private updatedCount: number = null;

  constructor(private query: GeneQuery, private resultCount: number,
              private creationStamp: number = null) {
    this.id = historyEntryCounter++;
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
    o.resultCount = this.resultCount;
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

  getEntryId(): number {
    return this.id;
  }
}

@Injectable()
export class QueryService {
  private apiUrl = '/api/v1/dataset/latest';

  private history: Array<HistoryEntry> = [];
  private subject: Subject<Array<HistoryEntry>> = new Subject();

  constructor(private http: Http) {
    try {
      let savedHistoryString = localStorage.getItem(localStorageKey);
      if (savedHistoryString) {
        this.history = [];

        for (let o of JSON.parse(savedHistoryString)) {
          try {
            const query = new GeneQuery(o.constraints);
            const entry = new HistoryEntry(query, o.resultCount);
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
    } catch (e) {
      console.log('failed to deserialise history: ' + e.message);
    }
  }

  private postRaw(query: GeneQuery, outputOptions: QueryOutputOptions): Observable<Response> {
    const jsonString = query.toPostJSON(outputOptions);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this.apiUrl + '/query', jsonString, options);
  }

  postQuery(query: GeneQuery, outputOptions: QueryOutputOptions): Observable<QueryResult> {
    return this.postRaw(query, outputOptions)
      .map((res) => { return makeResults(query, res.json()); });
  }
  postQueryCount(query: GeneQuery): Observable<number> {
    const outputOptions = new QueryOutputOptions([], 'none');
    return this.postRaw(query, outputOptions)
      .map((res) => { return res.json().rows.length; });
  }

  postPredefinedQuery(queryName: string, outputOptions: QueryOutputOptions): Observable<QueryResult> {
    const query = new GeneQuery(getAppConfig().getPredefinedQuery(queryName));
    return this.postQuery(query, outputOptions);
  }

  postPredefinedQueryCount(queryName: string): Observable<number> {
    const query = new GeneQuery(getAppConfig().getPredefinedQuery(queryName));
    return this.postQueryCount(query);
  }

  private saveHistory() {
    let historyObjects = this.history.map((e) => e.toObject());
    localStorage.setItem(localStorageKey, JSON.stringify(historyObjects));
  }

  historyEntryById(historyEntryId: number): GeneQuery {
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

  saveToHistoryWithCount(query: GeneQuery, count: number): HistoryEntry {
    this.deleteExisting(query);
    const entry = new HistoryEntry(query, count, new Date().getTime());
    this.history.unshift(entry);
    this.subject.next(this.history);
    this.saveHistory();
    return entry;
  }

  saveToHistory(query: GeneQuery,
                doneCallback?: (historyEntry: HistoryEntry) => void) {
    this.postQueryCount(query)
      .subscribe((count) => {
        const historyEntry = this.saveToHistoryWithCount(query, count);
        if (doneCallback) {
          doneCallback(historyEntry);
        }
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
            .subscribe((count) => {
              histEntry.setUpdatedCount(count);
              subscription.unsubscribe();
            });
        });
      };
    for (let i = 0; i < this.history.length; i++) {
      countUpdater(this.history[i], i * 100);
    }
  }
}
