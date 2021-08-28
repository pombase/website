import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject, BehaviorSubject, timer } from 'rxjs';
import { GeneQuery, QueryResult, QueryIdNode, GeneUniquename, ResultRow, TermAndName } from './pombase-query';
import { getAppConfig } from './config';
import { PombaseAPIService } from './pombase-api.service';

export interface DisplayResultRow {
  uniquename: string;
  [fieldName: string]: any;
}
type SequenceOptions = 'protein' | 'none' | {
  nucleotide: {
    include_introns: boolean,
    include_5_prime_utr: boolean,
    include_3_prime_utr: boolean,
  },
};

export class GAFOptions {
  constructor(public aspects: Array<string>) { }
}

type OutputFlag = 'include_gene_subsets';

export class QueryOutputOptions {
  constructor(public field_names: Array<string>,
              public flags: Array<OutputFlag>,
              private sequence?: SequenceOptions,
              private gaf_options?: GAFOptions) {
    if (!this.sequence) {
      this.sequence = 'none';
    }
    if (!this.gaf_options) {
      this.gaf_options = new GAFOptions([]);
    }
  }
}

const localStorageKey = 'pombase-query-build-history-v1';

const QUERY_CACHE_MAX = 20;

export class HistoryEntry {

  // assign internal IDs where they are missing/null
  static internalIdCounter = 1;
  checked = false;
  private updatedCount: number|undefined = undefined;

  constructor(private id: string, private query: GeneQuery, private resultCount: number,
    private creationStamp: number|null = null) {
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

  hasEditedName(): boolean {
    return !this.query.getQueryName() || this.query.getQueryName() !== this.query.toString();
  }

  getResultCount(): number {
    return this.resultCount;
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

  getUpdatedCount(): number|undefined {
    return this.updatedCount;
  }

  getEntryId(): string {
    return this.id;
  }

  queryName(): string|undefined {
    return this.getQuery().getQueryName();
  }
}

@Injectable()
export class QueryService {
  private apiUrl = '/api/v1/dataset/latest';

  private history: Array<HistoryEntry> = [];
  private subject: BehaviorSubject<Array<HistoryEntry>>;

  private queryCache: Array<QueryResult> = [];

  constructor(private pombaseApiService: PombaseAPIService,
              private http: HttpClient) {
    try {
      let savedHistoryString = localStorage.getItem(localStorageKey);
      if (savedHistoryString) {
        this.history = [];

        for (let o of JSON.parse(savedHistoryString)) {
          try {
            const entry = this.entryFromJsonObject(o);
            this.history.push(entry);
          } catch (e: any) {
            console.log('failed to deserialise: ' + JSON.stringify(o) + ' - ' + e.message);
          }
        };

        const timer$ = timer(200);
        const subscription = timer$.subscribe(() => {
          this.setAllCounts();
          subscription.unsubscribe();
        });

      }
    } catch (e: any) {
      console.log('failed to deserialise history: ' + e.message);
    }
    this.subject = new BehaviorSubject(this.history);
  }

  // make a HistoryEntry from a query parsed from JSON
  private entryFromJsonObject(o: any) {
    let id = o.id;
    const query = GeneQuery.fromJSONString(o);
    const entry = new HistoryEntry(id, query, o.resultCount);
    return entry;
  }

  // return null on success or a string with an error message
  public saveImportedQueries(queriesString: string): string|undefined {
    try {
      const queriesObjects = JSON.parse(queriesString);

      if (queriesObjects instanceof Array) {
        queriesObjects.reverse();
        for (let obj of queriesObjects) {
          try {
            const entry = this.entryFromJsonObject(obj);
            this.deleteExisting(entry.getQuery());
            this.history.unshift(entry);
            this.subject.next(this.history);
          } catch {
            return 'cannot parse a query from: ' + JSON.stringify(obj);
          }
        }
        this.saveHistory();
        this.setAllCounts();
      } else {
        return 'import failed: text isn\'t an exported query list';
      }
    } catch (e: any) {
      return 'failed to parse imported queries: ' + e.toString();
    }
    return undefined; // no error
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
    const outputOptions = new QueryOutputOptions([], []);
    return this.postRaw(query, outputOptions);
  }

  postPredefinedQuery(queryName: string, name: string, outputOptions: QueryOutputOptions): Promise<QueryResult> {
    const query = GeneQuery.fromJSONString(getAppConfig().getPredefinedQuery(queryName));
    return this.postQuery(query, outputOptions);
  }

  postPredefinedQueryCount(queryName: string): Promise<QueryResult> {
    const query = GeneQuery.fromJSONString(getAppConfig().getPredefinedQuery(queryName));
    return this.postQueryCount(query);
  }

  private saveHistory() {
    localStorage.setItem(localStorageKey, this.historyAsJson());
  }

  historyEntryById(historyEntryId: string): HistoryEntry|undefined {
    for (let entry of this.history) {
      if (entry.getEntryId() === historyEntryId) {
        return entry;
      }
    }
    return undefined;
  }

  editQueryName(histId: string, newName: string): Promise<void> {
    let histEntry = this.historyEntryById(histId);
    if (histEntry) {
      histEntry.getQuery().setQueryName(newName);
      const promise = new Promise<void>((resolve) => {
      this.runAndSaveToHistory(histEntry!.getQuery(),
                               () => {
                                 resolve();
                               });
      });
      return promise;
    } else {
      return new Promise(() => undefined);
    }
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

  execNoSave(query: GeneQuery, outputOptions?: QueryOutputOptions): Promise<QueryResult> {
    return this.postQuery(query, outputOptions)
      .then((result: QueryResult) => {
        return result;
      });
  }

  exec(query: GeneQuery, outputOptions?: QueryOutputOptions): Promise<QueryResult> {
    return this.postQuery(query, outputOptions)
      .then((result: QueryResult) => {
        this.saveResultsToHistory(result);
        return result;
      });
  }

  getFromCache(id: string): QueryResult|undefined {
   for (const cachedQueryResult of this.queryCache) {
     if (id === cachedQueryResult.getId()) {
       return cachedQueryResult;
     }
   }
   return undefined;
  }

  addToResultCache(queryResult: QueryResult): void {
    if (this.getFromCache(queryResult.getId())) {
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
      this.saveResultsToHistory(cachedQueryResult);
      return Promise.resolve(cachedQueryResult);
    }
    let histEntry = this.historyEntryById(id);
    let query = null;
    if (histEntry) {
      query = histEntry.getQuery();
    } else {
      query = new GeneQuery(new QueryIdNode(undefined, id));
    }
    return this.postQuery(query, outputOptions)
      .then((result: QueryResult) => {
        this.saveResultsToHistory(result);
        return result;
      });
  }

  async queryGenesWithFields(geneUniquenames: Array<GeneUniquename>,
                             fieldNames: Array<string>,
                             sequenceOptions?: SequenceOptions): Promise<Array<DisplayResultRow>> {
    let queryPromise: Promise<QueryResult|undefined>;

    let fieldsForServer: Array<string> = [];

    const geneResultsConfig = getAppConfig().getGeneResultsConfig();

    fieldNames.map(fieldName => {
      if (!geneResultsConfig.geneSummaryFieldNames.includes(fieldName)) {
        fieldsForServer.push(fieldName);
      }
    })

    if (fieldsForServer.length === 0 && !sequenceOptions) {
      queryPromise = Promise.resolve(undefined);
    } else {
      const query = GeneQuery.fromGeneUniquenames(undefined, geneUniquenames);
      const options = new QueryOutputOptions(['gene_uniquename', ...fieldsForServer], [],
                                             sequenceOptions || 'none');
      queryPromise = this.execNoSave(query, options);
    }

    const queryResults = await queryPromise;

    const geneSummaryMap = await this.pombaseApiService.getGeneSummaryMapPromise();

    const rowProcessor = (geneUniquename: GeneUniquename, serverRow?: ResultRow) => {
      if (serverRow?.gene_expression) {
        const geneEx = serverRow?.gene_expression;
        delete serverRow?.gene_expression;
        geneEx.map(geneExValue => {
          serverRow['gene_ex_avg_copies_per_cell:' + geneExValue.dataset_name] = geneExValue.value;
        });
      }

      const geneSummary = geneSummaryMap[geneUniquename];
      const displayRow: any = {};

      displayRow['uniquename'] = geneSummary.uniquename;

      for (const fieldName of fieldNames) {
        displayRow[fieldName] = geneSummary.getFieldDisplayValue(fieldName);
      }

      if (sequenceOptions && serverRow) {
        displayRow['sequence'] = serverRow.sequence;
      }

      for (const serverFieldName of fieldsForServer) {
        const fieldConfig = geneResultsConfig.field_config[serverFieldName];
        const rawServerValue = serverRow ? serverRow[serverFieldName] : undefined;

        if (typeof(rawServerValue) === 'undefined') {
          displayRow[serverFieldName] = '';
        } else {
          switch (fieldConfig.column_type) {
            case 'gene_list':
              const fieldValue = rawServerValue || [];
              displayRow[serverFieldName] =
                (fieldValue as Array<string>)
                  .map(uniquename => geneSummaryMap[uniquename].displayName()).join(',');
              break;

            case 'ontology_term':
              if (typeof(rawServerValue) === 'string') {
                displayRow[serverFieldName] = rawServerValue;
              } else {
                displayRow[serverFieldName] = (rawServerValue as { term: TermAndName }).term.termid;
              }
              break;

            default:
              displayRow[serverFieldName] = rawServerValue;
          }
        }
      }

      return displayRow as DisplayResultRow;
    };

    if (queryResults) {
      return queryResults.getRows().map(resultRow => rowProcessor(resultRow.gene_uniquename, resultRow));
    } else {
      return geneUniquenames.map(geneUniquename => rowProcessor(geneUniquename));
    }
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

  historyAsJson(space?: string|number): string {
    let historyObjects = this.history.map((e) => e.toObject());
    return JSON.stringify(historyObjects, null, space);
  }

  setAllCounts() {
    const countUpdater =
      (histEntry: HistoryEntry, delay: number) => {
        const query = histEntry.getQuery();

        let timer$ = timer(delay);
        const subscription = timer$.subscribe(() => {
          this.postQueryCount(query)
            .then((res) => {
              histEntry.setUpdatedCount(res.getRowCount());
              this.subject.next(this.history);
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
