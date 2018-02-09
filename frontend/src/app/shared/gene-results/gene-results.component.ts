import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { QueryResult } from '../../pombase-query';
import { PombaseAPIService } from '../../pombase-api.service';

@Component({
  selector: 'app-gene-results',
  templateUrl: './gene-results.component.html',
  styleUrls: ['./gene-results.component.css']
})
export class GeneResultsComponent implements OnInit, OnChanges {
  @Input() results: QueryResult;
  @Input() description: string = '';

  displayResults = null;
  descriptionParts = [];
  legend = null;
  termsInQuery = [];

  constructor(private pombaseApiService: PombaseAPIService) { }

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.results) {
      this.pombaseApiService.getGeneSummaryMapPromise()
        .then((geneSummaries) => {
          this.displayResults =
            this.results.rows.map((row) => {
              return geneSummaries[row.gene_uniquename];
            });

          if (this.description) {
            this.termsInQuery = this.results.query.referencedTerms();
            const termids = this.termsInQuery.map(term => term.termid);
            const termidRe = new RegExp('(' + termids.join('|') + ')');

            const descriptionBits = this.description.split(termidRe);
            this.descriptionParts =
              descriptionBits.map(bit => {
                const index = termids.indexOf(bit);
                if (index === -1) {
                  return {
                    text: bit,
                  };
                } else {
                  return {
                    term: this.termsInQuery[index],
                  };
                }
              });

            this.legend = 'Result';
            if (this.displayResults.length > 5) {
              this.legend += `: ${this.displayResults.length} genes`;
            }
          } else {
            this.legend = '';
            this.descriptionParts = [];
          }
        });
    } else {
      this.displayResults = null;
    }
  }
}
