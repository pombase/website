import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { AnnotationType } from '../config';

@Component({
  selector: 'app-term-external-links',
  templateUrl: './term-external-links.component.html',
  styleUrls: ['./term-external-links.component.css']
})
export class TermExternalLinksComponent implements OnInit, OnChanges {
  @Input() typeConfig: AnnotationType;
  @Input() termId: string;
  linkConfigKeys: Array<string> = [];

  termIdForLink = '';

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
    let typeConf = this.typeConfig;
    let externDbLinkKeys = typeConf.external_db_link_keys;
    if (externDbLinkKeys) {
      this.linkConfigKeys = externDbLinkKeys;
    }

    if (this.typeConfig.is_a_fake_ontology) {
      this.termIdForLink = this.termId.replace(/^.*?:/, '');
    } else {
      this.termIdForLink = this.termId;
    }
  }
}
