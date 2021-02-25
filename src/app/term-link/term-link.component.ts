import { Component, Input, OnInit } from '@angular/core';
import { SolrTermSummary } from '../complete.service';
import { AnnotationTableConfig, getAnnotationTableConfig } from '../config';
import { PombaseAPIService } from '../pombase-api.service';
import { TermShort } from '../pombase-query';

@Component({
  selector: 'app-term-link',
  templateUrl: './term-link.component.html',
  styleUrls: ['./term-link.component.css']
})
export class TermLinkComponent implements OnInit {
  @Input() term: TermShort;

  config = getAnnotationTableConfig();

  termSummary: SolrTermSummary|undefined = undefined;
  cvDisplayName = '';

  constructor(private pombaseApiService: PombaseAPIService) { }

  shown() {
    this.pombaseApiService.termSummaryById(this.term.termid)
      .then(termSummary => {
        this.termSummary = termSummary;

        if (termSummary) {
          let typeConfig = this.config.getAnnotationType(termSummary.cv_name);
          this.cvDisplayName = typeConfig.display_name;
        }
      });
  }

  ngOnInit() {
  }
}
