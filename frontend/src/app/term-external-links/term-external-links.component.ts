import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-term-external-links',
  templateUrl: './term-external-links.component.html',
  styleUrls: ['./term-external-links.component.css']
})
export class TermExternalLinksComponent implements OnInit {
  @Input() typeConfig;
  @Input() termId;
  linkConfigKeys = [];

  constructor() { }

  ngOnInit() {
    let typeConf = this.typeConfig;
    let externDbLinkKeys = typeConf.external_db_link_keys;
    if (externDbLinkKeys) {
      this.linkConfigKeys = externDbLinkKeys;
    }
  }
}
