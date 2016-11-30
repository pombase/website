import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';

import { GeneSummary } from '../common/pombase-query';
import { PombaseAPIService } from '../pombase-api.service';

import { TypeaheadMatch } from 'ng2-bootstrap/components/typeahead/typeahead-match.class';

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.css']
})
export class SearchBoxComponent implements OnInit {
  public selectedGene: string = '';

  @Input() geneSummaries: Array<any> = [];

  constructor(private pombaseApiService: PombaseAPIService,
              private router: Router) { }

  ngOnInit() {
    this.pombaseApiService.getGeneSummaries()
      .then(summaries => {
        this.geneSummaries = [];
        // add uniquename and name to the search
        summaries.forEach((data) => {
          if (data.name) {
            this.geneSummaries.push({
              searchData: data.name,
              uniquename: data.uniquename,
              name: data.name
            });
          }
        });
        summaries.forEach((data) => {
          this.geneSummaries.push({
            searchData: data.uniquename,
            uniquename: data.uniquename,
            name: data.name
          });
        });
        this.geneSummaries.sort(function (a, b) {
          if ((a.name || a.uniquename) < (b.name || b.uniquename)) {
            return -1;
          }
          if ((a.name || a.uniquename) > (b.name || b.uniquename)) {
            return 1;
          }
          return 0;
        });
      });
  }

  public typeaheadOnSelect(e: TypeaheadMatch): void {
    this.router.navigate(['/gene', e.item.uniquename]);
    this.selectedGene = '';
  }
}
