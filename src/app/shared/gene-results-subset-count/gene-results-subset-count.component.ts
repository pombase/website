import { Component, Input, OnInit } from '@angular/core';
import { GeneShort, GoCamModelId, GoCamMap, PombaseAPIService } from '../../pombase-api.service';
import { HistoryEntry, QueryOutputOptions, QueryService } from '../../query.service';
import { GeneListNode, GeneQuery, GeneUniquename, QueryResult } from '../../pombase-query';
import { Router } from '@angular/router';

class ProcessedRow {
  constructor(public gocamId: string, public gocamTitle: string,
              public geneUniquenames: Array<GeneUniquename>,
              public subsetTotalGenesCount: number) {
  }
}

@Component({
  selector: 'app-gene-results-subset-count',
  templateUrl: './gene-results-subset-count.component.html',
  styleUrl: './gene-results-subset-count.component.css',
  standalone: false
})
export class GeneResultsSubsetCountComponent implements OnInit {
  @Input() genes: Array<GeneShort>;
  @Input() subsetType: String;
  @Input() geneListDescription: string;

  gocamMap: GoCamMap;
  queryResult?: QueryResult = undefined;

  resultTable: Array<ProcessedRow> = [];
  subsetGeneUniquenames: { [subsetId: string]: Array<GeneUniquename> } = {};

  constructor(private pombaseApiService: PombaseAPIService,
              private queryService: QueryService,
              private router: Router) { }

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


  gotoResultsInSubset(gocamTitle: string, gocamId: GoCamModelId): void {
    const genes = this.subsetGeneUniquenames[gocamId];
    if (!genes) {
      return;
    }

    this.gotoGenes(gocamTitle, gocamId, false, genes);
  }

  gotoGenesInSubset(gocamTitle: string, gocamId: GoCamModelId): void {
    const genes = this.gocamMap[gocamId].activity_enabling_genes;
    if (!genes) {
      return;
    }

    this.gotoGenes(gocamTitle, gocamId, true, genes);
  }

  private gotoGenes(gocamTitle: string, gocamId: string, allGenes: boolean, genes: string[]) {
    let displayName = `GO-CAM pathway "${gocamTitle}"`;

    if (allGenes) {
      displayName = 'All genes from ' + displayName;
    } else {
      displayName = 'Genes from ' + this.geneListDescription + ' in ' + displayName;
    }
    const part = new GeneListNode(displayName, genes);
    const geneQuery = new GeneQuery(part);
    const callback = (historyEntry: HistoryEntry) => {
      this.router.navigate(['/results/from/id/', historyEntry.getEntryId()]);
    };
    this.queryService.runAndSaveToHistory(geneQuery, callback);
  }

  highlighInPathwayLink(gocamId: string, geneUniquenames: Array<string>): Array<string> {
    return ['/gocam', 'pombase-view', 'subset-count', gocamId,
      geneUniquenames.join(','), encodeURIComponent(this.geneListDescription)];
  }

  sortRows(): void {
    const sortRows = function (rowA: ProcessedRow, rowB: ProcessedRow) {
      if (rowA.geneUniquenames.length == 0 && rowB.geneUniquenames.length == 0) {
        return rowA.gocamTitle.localeCompare(rowB.gocamTitle);
      }
      if (rowA.geneUniquenames.length != 0 && rowB.geneUniquenames.length != 0) {
        return rowB.geneUniquenames.length - rowA.geneUniquenames.length;
      }
      if (rowA.geneUniquenames.length === 0) {
        return 1;
      } else {
        return -1;
      }
    };

    this.resultTable.sort(sortRows);
  }

  makeResultTable() {
    this.subsetGeneUniquenames = {};
    for (const row of this.queryResult!.getRows()) {
      if (row.subsets) {
        for (let subsetId of row.subsets) {
          if (subsetId.startsWith("gomodel:")) {
            subsetId = subsetId.replace("gomodel:", "");
            if (this.subsetGeneUniquenames[subsetId]) {
              this.subsetGeneUniquenames[subsetId].push(row.gene_uniquename);
            } else {
              this.subsetGeneUniquenames[subsetId] = [row.gene_uniquename];
            }
          }
        }
      }
    }

    let resultTable: Array<ProcessedRow> = [];

    for (const gocamId of Object.keys(this.gocamMap)) {
      let geneUniquenames: Array<GeneUniquename> = [];
      if (this.subsetGeneUniquenames[gocamId]) {
        geneUniquenames = this.subsetGeneUniquenames[gocamId];
      }

      const row = new ProcessedRow(gocamId, this.gocamMap[gocamId].title, geneUniquenames,
                                   this.gocamMap[gocamId].activity_enabling_genes.length);
      resultTable.push(row);
    }

    this.resultTable = resultTable;

    this.sortRows();
  }

  ngOnInit() {
    this.pombaseApiService.getAllGoCamDetailsMap()
      .then(gocamMap => {
        this.gocamMap = gocamMap;
        this.runQuery();
      })
  }
}
