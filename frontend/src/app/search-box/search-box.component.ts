import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PombaseAPIService, GeneSummary } from '../pombase-api.service';

import { TypeaheadMatch } from 'ng2-bootstrap/typeahead/typeahead-match.class';

interface Model extends GeneSummary {
  searchData: string;
}

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.css']
})
export class SearchBoxComponent implements OnInit {
  public fieldValue = '';
  noResults = true;

  lastMatchIdentifier = '';

  geneSummaries: Array<Model> = [];

  constructor(private pombaseApiService: PombaseAPIService,
              private router: Router) { }

  matchType(modelValue: Model): string {
    this.lastMatchIdentifier = null;

    if (this.fieldValue) {
      let value = this.fieldValue.trim().toLowerCase();

      if (modelValue.name && modelValue.name.toLowerCase().indexOf(value) !== -1) {
        return 'name';
      }
      if (modelValue.uniquename.indexOf(value) !== -1) {
        return 'uniquename';
      }
      if (modelValue.synonyms.find((syn) => {
        if (syn.toLowerCase().indexOf(value) !== -1) {
          this.lastMatchIdentifier = syn;
          return true;
        } else {
          return false;
        }
      })) {
        return 'synonym';
      }
      if (modelValue.product && modelValue.product.toLowerCase().indexOf(value) !== -1) {
        return 'product';
      }
      if (modelValue.orthologs.find((orth) => {
        if (orth.identifier.toLowerCase().indexOf(value) !== -1) {
          this.lastMatchIdentifier = orth.identifier;
          return true;
        } else {
          return false;
        }
      })) {
        return 'ortholog';
      }
    }
    return 'none';
  }

  ngOnInit() {
    this.pombaseApiService.getGeneSummaries()
      .then(summaries => {
        this.geneSummaries = [];
        summaries.forEach((data) => {
          if (data.name) {
            this.geneSummaries.push({
              searchData: data.name.toLowerCase(),
              ...data,
            });
          }
        });

        let summaryCmp =
          (a, b) => {
            if (a.name) {
              if (b.name) {
                return a.name.localeCompare(b.name);
              } else {
                return -1;
              }
            } else {
              if (b.name) {
                return 1;
              } else {
                return a.uniquename.localeCompare(b.uniquename);
              }
            }
          };

        this.geneSummaries.sort(summaryCmp);

        let uniquenameSummaries = [];
        summaries.forEach((data) => {
          uniquenameSummaries.push({
            searchData: data.uniquename.toLowerCase(),
            ...data
          });
        });

        this.geneSummaries = this.geneSummaries.concat(uniquenameSummaries);

        let synonymSummaries = [];
        summaries.forEach((data) => {
          data.synonyms.forEach((synonym) => {
            synonymSummaries.push({
              searchData: synonym.toLowerCase(),
              ...data
            });
          });
        });

        this.geneSummaries = this.geneSummaries.concat(synonymSummaries);

        let orthologSummaries = [];
        summaries.forEach((data) => {
          data.orthologs.forEach((ortholog) => {
            orthologSummaries.push({
              searchData: ortholog.identifier.toLowerCase(),
              ...data
            });
          });
        });

        this.geneSummaries = this.geneSummaries.concat(orthologSummaries);

        let productSummaries = [];
        summaries.forEach((data) => {
          if (data.product) {
            productSummaries.push({
              searchData: data.product.toLowerCase(),
                ...data
            });
          }
        });
        productSummaries.sort(summaryCmp);

        this.geneSummaries = this.geneSummaries.concat(productSummaries);
      });
  }

  public typeaheadOnSelect(e: TypeaheadMatch): void {
    this.router.navigate(['/gene', e.item.uniquename]);
    this.fieldValue = '';
  }

  public typeaheadNoResults(e: boolean) {
    this.noResults = e;
  }

  getVisibility(): string {
    if (this.noResults && this.fieldValue.length > 0) {
      return 'visible';
    } else {
      return 'hidden';
    }
  }
}
