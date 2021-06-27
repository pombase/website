import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { SolrTermSummary } from '../complete.service';
import { getAnnotationTableConfig } from '../config';
import { PombaseAPIService } from '../pombase-api.service';
import { getAppConfig } from '../config';
import { TermShort } from '../pombase-query';
import { PopoverDirective } from 'ngx-bootstrap/popover';

@Component({
  selector: 'app-term-link',
  templateUrl: './term-link.component.html',
  styleUrls: ['./term-link.component.css']
})
export class TermLinkComponent implements OnInit {
  @Input() term: TermShort;
  @Input() hideTermIdPrefix = false;

  @ViewChild('link', {static: false}) link: PopoverDirective;

  mouseIn = false;

  config = getAnnotationTableConfig();
  appConfig = getAppConfig();

  termSummary: SolrTermSummary|undefined = undefined;
  cvDisplayName = '';

  constructor(private pombaseApiService: PombaseAPIService) { }

  mouseEnter(): void {
    this.mouseIn = true;
    setTimeout(() => {
      if (this.mouseIn && this.link) {
        this.link.show();
      }
    }, this.appConfig.details_popup_delay);

  }

  mouseLeave(): void {
    this.mouseIn = false;
    this.link.hide();
  }

  ngOnDestroy(): void {
    this.link.hide();
    this.mouseIn = false;
  }

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

  getDisplayTermId(): string {
    if (this.hideTermIdPrefix) {
      return this.term.termid.replace(/^.*?:/, '');
    } else {
      return this.term.termid;
    }
  }

  ngOnInit() {
  }
}
