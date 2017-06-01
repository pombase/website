import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { GeneSubsetDetails, PombaseAPIService } from '../pombase-api.service';

@Component({
  selector: 'app-gene-subset-view',
  templateUrl: './gene-subset-view.component.html',
  styleUrls: ['./gene-subset-view.component.css']
})
export class GeneSubsetViewComponent implements OnInit {
  subset: GeneSubsetDetails = null;
  subsetDisplayName = null;
  apiError = null;

  constructor(private pombaseApiService: PombaseAPIService,
              private route: ActivatedRoute,
              private titleService: Title,
             ) { }

  setPageTitle(): void {
    let title = this.titleService.getTitle();
    if (this.subset) {
      this.titleService.setTitle(title + ' - ' + this.subset.name);
    }
  }

  ngOnInit() {
    this.pombaseApiService.getGeneSubsets()
      .then(subsets => {
        this.route.params.forEach((params: Params) => {
          if (params['subsetName'] !== undefined) {
            let subsetName = params['subsetName'];
            this.subset = subsets[subsetName];
            if (this.subset) {
              let matchResults = this.subset.display_name.match(/characterisation_status:(.*)/);
              if (matchResults) {
                this.subsetDisplayName =
                  'Genes with characterisation status "' + matchResults[1] +
                  '": ' + this.subset.elements.length;
              }
            } else {
              this.apiError = {
                status: 404,
                message: 'no such subset: ' + subsetName,
              };
            }
            this.setPageTitle();
          }
        });
      })
      .catch(error => {
        this.apiError = error;
      });
  }
}
