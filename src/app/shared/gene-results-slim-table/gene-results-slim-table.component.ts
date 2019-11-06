import { Component, OnInit, Input } from '@angular/core';
import { GeneShort, PombaseAPIService, TermSubsetDetails, GeneSummary, GeneSummaryMap } from '../../pombase-api.service';
import { GeneListNode, GeneQuery, QueryOutputOptions, QueryResult, TermId, GeneUniquename } from '../../pombase-query';
import { QueryService, HistoryEntry } from '../../query.service';
import { Router } from '@angular/router';

class ProcessedRow {
  constructor(public termId: string, public termName: string,
              public geneUniquenames: Array<GeneUniquename>) {
  }
}

@Component({
  selector: 'app-gene-results-slim-table',
  templateUrl: './gene-results-slim-table.component.html',
  styleUrls: ['./gene-results-slim-table.component.css']
})
export class GeneResultsSlimTableComponent implements OnInit {
  @Input() genes: Array<GeneShort> = [];
  @Input() slimName: string = null;

  subsetDetails: TermSubsetDetails = null;
  resultTable: Array<ProcessedRow> = [];
  termGeneUniquenames: { [termId: string]: Array<GeneUniquename>} = {};

  countsReady = false;
  slimmedGenes: Set<GeneUniquename> = null;
  unslimmedGenes: Set<GeneUniquename> = null;

  constructor(private pombaseApiService: PombaseAPIService,
              private queryService: QueryService,
              private router: Router) {
  }

  runQuery(slimName: string): void {
    const geneListNode = new GeneListNode(this.genes);
    const geneListQuery = new GeneQuery(null, geneListNode);

    const outputOptions =
      new QueryOutputOptions(['gene_uniquename'], ['include_gene_subsets'], 'none');
    this.queryService.postQuery(geneListQuery, outputOptions)
      .then(results => {
        this.resultTable = this.makeResultTable(results);
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

  makeResultTable(results: QueryResult): Array<ProcessedRow> {
    this.countsReady = false;

    this.termGeneUniquenames = {};
    for (const row of results.getRows()) {
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

    for (const subsetTermDetail of this.subsetDetails.elements) {
      let geneUniquenames: Array<GeneUniquename> = [];
      if (this.termGeneUniquenames[subsetTermDetail.termid]) {
        geneUniquenames = this.termGeneUniquenames[subsetTermDetail.termid];
      }

      const row = new ProcessedRow(subsetTermDetail.termid, subsetTermDetail.name, geneUniquenames);
      resultTable.push(row);
    }

    const sortRows = function(rowA: ProcessedRow, rowB: ProcessedRow) {
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

    this.pombaseApiService.getGeneSummaryMapPromise()
      .then(geneSummaryMap => this.calcGeneStats(geneSummaryMap, resultTable));

    return resultTable.sort(sortRows);
  }

  gotoGenesOfTerm(termId: TermId): void {
    const genes = this.termGeneUniquenames[termId];
    if (!genes) {
      return;
    }

    this.gotoGenes(genes);
  }

  private gotoGenes(genes: string[]) {
    const part = new GeneListNode(genes);
    const geneQuery = new GeneQuery(null, part);
    const callback = (historyEntry: HistoryEntry) => {
      this.router.navigate(['/results/from/id/', historyEntry.getEntryId()]);
    };
    this.queryService.runAndSaveToHistory(geneQuery, callback);
  }

  gotoUnslimmedGenes(): void {
    this.gotoGenes(Array.from(this.unslimmedGenes));
  }

  ngOnInit() {
    this.pombaseApiService.getTermSubsets()
      .then(subsets => {
        this.subsetDetails = subsets[this.slimName];
        this.runQuery(this.slimName);
      });
  }
}
