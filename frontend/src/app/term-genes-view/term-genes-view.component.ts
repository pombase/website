import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { TermDetails, Annotation, PombaseAPIService } from '../pombase-api.service';

@Component({
  selector: 'app-term-genes-view',
  templateUrl: './term-genes-view.component.html',
  styleUrls: ['./term-genes-view.component.css']
})
export class TermGenesViewComponent implements OnInit {
  @Input() termDetails: TermDetails;

  constructor(private pombaseApiService: PombaseAPIService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      if (params['termid'] !== undefined) {
        let termid = params['termid'];
        this.pombaseApiService.getTerm(termid)
              .then(termDetails => {
                this.termDetails = termDetails;
              });
      };
    });
  }
}
