import { Component, OnInit, Input } from '@angular/core';
import { GeneShort, PombaseAPIService, TermSubsetDetails, GeneSummaryMap } from '../../pombase-api.service';
import { GeneListNode, GeneQuery, QueryResult, TermId, GeneUniquename } from '../../pombase-query';
import { QueryService, HistoryEntry, QueryOutputOptions } from '../../query.service';
import { Router } from '@angular/router';
import { AppConfig, getAppConfig, SlimConfig } from '../../config';

class ProcessedRow {
  constructor(public termId: string, public termName: string,
              public geneUniquenames: Array<GeneUniquename>) {
  }
}

type SortableColumnNames = 'name' | 'gene_count';

@Component({
  selector: 'app-gene-results-slim-table',
  templateUrl: './gene-results-slim-table.component.html',
  styleUrls: ['./gene-results-slim-table.component.css']
})
export class GeneResultsSlimTableComponent implements OnInit {
  @Input() genes: Array<GeneShort> = [];
  @Input() slimName: string;
  // probably the query name
  @Input() geneListDescription: string;

  subsetDetails: TermSubsetDetails;
  queryResult?: QueryResult = undefined;
  resultTable: Array<ProcessedRow> = [];
  termGeneUniquenames: { [termId: string]: Array<GeneUniquename>} = {};

  countsReady = false;
  slimmedGenes: Set<GeneUniquename>;
  unslimmedGenes: Set<GeneUniquename>;
  appConfig: AppConfig = getAppConfig();
  slimConfig: SlimConfig;

  sortColumnName: SortableColumnNames = 'name';

  constructor(private pombaseApiService: PombaseAPIService,
              private queryService: QueryService,
              private router: Router) {
  }

  runQuery(): void {
    const geneListNode = new GeneListNode(undefined, this.genes);
    const geneListQuery = new GeneQuery(geneListNode);

    const outputOptions =
      new QueryOutputOptions(['gene_uniquename'], ['include_gene_subsets'], [], 'none');
    this.queryService.postQuery(geneListQuery, outputOptions)
      .then(queryResult => {
        this.queryResult = queryResult;
        this.makeResultTable();
      });
  }

  calcGeneStats(geneSummarymap: GeneSummaryMap, resultTable: Array<ProcessedRow>): void {
    let seenGenes: Set<string> = new Set();

    for (const row of resultTable) {
      row.geneUniquenames.map(geneUniquename => seenGenes.add(geneUniquename));
    }

    this.slimmedGenes = seenGenes;

    const proteinCodingGenes =
      this.genes.filter(geneShort => {
        const summary = geneSummarymap[geneShort.uniquename];
        return summary && summary.feature_type === 'mRNA gene';
      }).map(geneShort => geneShort.uniquename);

    this.unslimmedGenes = new Set([...proteinCodingGenes]);

    seenGenes.forEach(geneUniquename => this.unslimmedGenes.delete(geneUniquename));

    this.countsReady = true;
  }

  sortRows(): void {
    const sortRows = function (rowA: ProcessedRow, rowB: ProcessedRow) {
      if (rowA.geneUniquenames.length === 0 && rowB.geneUniquenames.length === 0 ||
        rowA.geneUniquenames.length !== 0 && rowB.geneUniquenames.length !== 0) {
        return rowA.termName.localeCompare(rowB.termName);
      }
      if (rowA.geneUniquenames.length === 0) {
        return 1;
      } else {
        return -1;
      }
    };

    if (this.sortColumnName == 'name') {
      this.resultTable.sort(sortRows);
    } else {
      const sortRowsByCount =
        (a: ProcessedRow, b: ProcessedRow) => b.geneUniquenames.length - a.geneUniquenames.length;
      this.resultTable.sort(sortRowsByCount);
    }
  }

  setSortColumn(col: SortableColumnNames): void {
    this.sortColumnName = col;
    this.makeResultTable();
  }

  makeResultTable() {
    this.countsReady = false;

    this.termGeneUniquenames = {};
    for (const row of this.queryResult!.getRows()) {
      if (row.subsets) {
        for (const subsetTermId of row.subsets as Array<TermId>) {
          if (this.termGeneUniquenames[subsetTermId]) {
            this.termGeneUniquenames[subsetTermId].push(row.gene_uniquename);
          } else {
            this.termGeneUniquenames[subsetTermId] = [row.gene_uniquename];
          }
        }
      }
    }

    let resultTable: Array<ProcessedRow> = [];

    for (const termid of Object.keys(this.subsetDetails.elements)) {
      let geneUniquenames: Array<GeneUniquename> = [];
      if (this.termGeneUniquenames[termid]) {
        geneUniquenames = this.termGeneUniquenames[termid];
      }

      const element = this.subsetDetails.elements[termid];

      const row = new ProcessedRow(termid, element.name, geneUniquenames);
      resultTable.push(row);
    }

    this.pombaseApiService.getGeneSummaryMapPromise()
      .then(geneSummaryMap => this.calcGeneStats(geneSummaryMap, resultTable));

    this.resultTable = resultTable;

    this.sortRows();
  }

  gotoGenesOfTerm(termName: string, termId: TermId): void {
    const genes = this.termGeneUniquenames[termId];
    if (!genes) {
      return;
    }

    this.gotoGenes(termName, termId, genes);
  }

  private gotoGenes(termName: string|undefined, termId: string|undefined, genes: string[]) {
    let slimDisplayName = this.slimConfig.slim_display_name.toLowerCase();
    if (termId) {
      slimDisplayName = `genes annotated with "${termName}" (${termId}) in ${slimDisplayName}`;
    } else {
      slimDisplayName = `unslimmed genes from ${slimDisplayName}`;
    }
    if (this.geneListDescription) {
      slimDisplayName += ' of ' + this.geneListDescription;
    }
    const part = new GeneListNode(slimDisplayName, genes);
    const geneQuery = new GeneQuery(part);
    const callback = (historyEntry: HistoryEntry) => {
      this.router.navigate(['/results/from/id/', historyEntry.getEntryId()]);
    };
    this.queryService.runAndSaveToHistory(geneQuery, callback);
  }

  gotoUnslimmedGenes(): void {
    this.gotoGenes(undefined, undefined, Array.from(this.unslimmedGenes));
  }

  ngOnInit() {
    this.slimConfig = this.appConfig.slims[this.slimName];
    this.pombaseApiService.getTermSubsets()
      .then(subsets => {
        this.subsetDetails = subsets[this.slimName];
        this.runQuery();
      });
  }
}
