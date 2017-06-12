import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { PombaseAPIService } from '../pombase-api.service';

import { TypeaheadMatch } from 'ng2-bootstrap/typeahead/typeahead-match.class';

interface Model {
  searchData: string;
  name: string;
  uniquename: string;
  synonyms: Array<string>;
  product: string;
}

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.css']
})
export class SearchBoxComponent implements OnInit {
  public selectedGene = '';
  noResults = true;

  @Input() geneSummaries: Array<Model> = [];

  constructor(private pombaseApiService: PombaseAPIService,
              private router: Router) { }

  maybeSynonymMatch(model: Model): string {
    if (this.selectedGene) {
      if ((model.name && model.name.indexOf(this.selectedGene) === -1 ||
           model.uniquename.indexOf(this.selectedGene) === -1)  &&
          model.synonyms.find((syn) => { return syn.startsWith(model.searchData); })) {
        return 'synonym: ' + model.searchData;
      } else {
        return '';
      }
    } else {
      return '';
    }
  }

  maybeProductMatch(model: Model): string {
    if (this.selectedGene) {
      if (model.name && model.name.indexOf(this.selectedGene) !== -1 ||
          model.uniquename.indexOf(this.selectedGene) !== -1 ||
          model.synonyms.find((syn) => { return syn.startsWith(model.searchData); } )) {
        return '';
      } else {
        return model.product;
      }
    } else {
      return '';
    }
  }

  ngOnInit() {
    this.pombaseApiService.getGeneSummaries()
      .then(summaries => {
        this.geneSummaries = [];
        summaries.forEach((data) => {
          if (data.name) {
            this.geneSummaries.push({
              searchData: data.name,
              uniquename: data.uniquename,
              synonyms: data.synonyms,
              name: data.name,
              product: data.product,
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
            searchData: data.uniquename,
            uniquename: data.uniquename,
            synonyms: data.synonyms,
            name: data.name,
            product: data.product,
          });
        });

        this.geneSummaries = this.geneSummaries.concat(uniquenameSummaries);

        let synonymSummaries = [];
        summaries.forEach((data) => {
          data.synonyms.forEach((synonym) => {
            synonymSummaries.push({
              searchData: synonym,
              uniquename: data.uniquename,
              synonyms: data.synonyms,
              name: data.name,
              product: data.product,
            });
          });
        });

        this.geneSummaries = this.geneSummaries.concat(synonymSummaries);

        let productSummaries = [];
        summaries.forEach((data) => {
          if (data.product) {
            productSummaries.push({
              searchData: data.product,
              uniquename: data.uniquename,
              synonyms: data.synonyms,
              name: data.name,
              product: data.product,
            });
          }
        });
        productSummaries.sort(summaryCmp);

        this.geneSummaries = this.geneSummaries.concat(productSummaries);
      });
  }

  public typeaheadOnSelect(e: TypeaheadMatch): void {
    this.router.navigate(['/gene', e.item.uniquename]);
    this.selectedGene = '';
  }

  public typeaheadNoResults(e: boolean) {
    this.noResults = e;
  }

  getVisibility(): string {
    if (this.noResults && this.selectedGene.length > 0) {
      return 'visible';
    } else {
      return 'hidden';
    }
  }
}
