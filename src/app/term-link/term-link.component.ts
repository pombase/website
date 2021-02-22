import { Component, Input, OnInit } from '@angular/core';
import { SolrTermSummary } from '../complete.service';
import { PombaseAPIService } from '../pombase-api.service';
import { TermShort } from '../pombase-query';

@Component({
  selector: 'app-term-link',
  templateUrl: './term-link.component.html',
  styleUrls: ['./term-link.component.css']
})
export class TermLinkComponent implements OnInit {
  @Input() term: TermShort;

  termSummary: SolrTermSummary|undefined = undefined;;

  constructor(private pombaseApiService: PombaseAPIService) { }

  shown() {
    this.pombaseApiService.termSummaryById(this.term.termid)
      .then(termSummary => this.termSummary = termSummary);
  }

  ngOnInit() {
  }
}
