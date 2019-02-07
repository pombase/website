import { Component, OnInit, Input } from '@angular/core';
import { GeneShort, PombaseAPIService, TermSubsetDetails } from '../../pombase-api.service';
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

  constructor(private pombaseApiService: PombaseAPIService,
              private queryService: QueryService,
              private router: Router) {
  }

  runQuery(slimName: string): void {
    const geneListNode = new GeneListNode(this.genes);
    const geneListQuery = new GeneQuery(geneListNode);

    const outputOptions =
      new QueryOutputOptions(['gene_uniquename'], ['include_gene_subsets'], 'none');
    this.queryService.postQuery(geneListQuery, outputOptions)
      .subscribe(results => {
        this.resultTable = this.makeResultTable(results);
      });
  }

  makeResultTable(results: QueryResult): Array<ProcessedRow> {
    this.termGeneUniquenames = {};
    for (const row of results.rows) {
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

    let resultTable = [];

    for (const subsetTermDetail of this.subsetDetails.elements) {
      let geneUniquenames: Array<GeneUniquename> = [];
      if (this.termGeneUniquenames[subsetTermDetail.termid]) {
        geneUniquenames = this.termGeneUniquenames[subsetTermDetail.termid];
      }

      const row = new ProcessedRow(subsetTermDetail.termid, subsetTermDetail.name, geneUniquenames);
      resultTable.push(row);
    }

    return resultTable.sort((rowA, rowB) => rowA.termName.localeCompare(rowB.termName));
  }

  gotoGenes(termId: TermId): void {
    const genes = this.termGeneUniquenames[termId];
    if (!genes) {
      return;
    }

    const part = new GeneListNode(genes);
    const geneQuery = new GeneQuery(part);
    const callback = (historyEntry: HistoryEntry) => {
      this.router.navigate(['/query/results/from/history/', historyEntry.getEntryId()]);
    };
    this.queryService.saveToHistory(geneQuery, callback);
  }

  ngOnInit() {
    this.pombaseApiService.getTermSubsets()
      .then(subsets => {
        this.subsetDetails = subsets[this.slimName];
        this.runQuery(this.slimName);
      });
  }
}
