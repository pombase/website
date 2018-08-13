import { Component, OnInit, Input, OnChanges } from '@angular/core';

import { PombaseAPIService, ReferenceShort } from '../pombase-api.service';

class RefGroup {
  constructor(public title: string,
              public refList: Array<ReferenceShort>) {}
}

@Component({
  selector: 'app-reference-detail-list',
  templateUrl: './reference-detail-list.component.html',
  styleUrls: ['./reference-detail-list.component.css']
})
export class ReferenceDetailListComponent implements OnInit, OnChanges {
  @Input() constraint = null;

  pageTitle = null;

  groups: Array<RefGroup> = [];

  constructor(private pombaseApiService: PombaseAPIService) { }

  ngOnInit() {
    if (this.constraint === 'community') {
      this.pageTitle = 'Community curated publications';
    }
  }

  extraDisplayString(reference: ReferenceShort): string {
    let ret = '';
    if (reference.authors_abbrev) {
      ret += reference.authors_abbrev;
    }
    if (reference.publication_year) {
      ret += ' (' + reference.publication_year + ')';
    }
    return ret;
  }

  refTitle(reference: ReferenceShort): string {
    let ret = reference.uniquename + ' - ' + reference.title;
    const extra = this.extraDisplayString(reference);
    if (extra.length > 0) {
      ret += ' ' + extra;
    }
    return ret;
  }

  makeGroups(references: Array<ReferenceShort>) {
    let groupMap = {};

    for (let ref of references) {
      if (ref.approved_date) {
        if (groupMap[ref.approved_date]) {
          groupMap[ref.approved_date].push(ref);
        } else {
          groupMap[ref.approved_date] = [ref];
        }
      }
    }

    this.groups = [];

    for (let date of Object.keys(groupMap).sort().reverse()) {
      this.groups.push(new RefGroup(date, groupMap[date]));
    }
  }

  ngOnChanges() {
    this.groups = [];

    this.pombaseApiService.getReferencesPromise(this.constraint)
      .then(references => this.makeGroups(references));
  }
}
