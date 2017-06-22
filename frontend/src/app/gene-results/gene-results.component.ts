import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { QueryResult } from '../pombase-query';
import { PombaseAPIService } from '../pombase-api.service';

@Component({
  selector: 'app-gene-results',
  templateUrl: './gene-results.component.html',
  styleUrls: ['./gene-results.component.css']
})
export class GeneResultsComponent implements OnInit, OnChanges {
  @Input() results: QueryResult;

  displayResults = null;
  legend = null;

  constructor(private pombaseApiService: PombaseAPIService) { }

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.results) {
      this.pombaseApiService.getGeneSummariesByUniquename()
        .then((geneSummaries) => {
          this.displayResults =
            this.results.rows.map((row) => {
              return geneSummaries[row.gene_uniquename];
            });

          this.legend = 'Result';
          if (this.displayResults.length > 5) {
            this.legend += `: ${this.displayResults.length} genes`;
          }
        });
    } else {
      this.displayResults = null;
    }
  }
}
