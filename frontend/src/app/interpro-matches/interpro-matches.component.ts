import { Component, OnInit, OnChanges, Input } from '@angular/core';

import { InterProMatch } from '../pombase-api.service';
import { getGoXrfWithPrefix } from '../config';

@Component({
  selector: 'app-interpro-matches',
  templateUrl: './interpro-matches.component.html',
  styleUrls: ['./interpro-matches.component.css']
})
export class InterproMatchesComponent implements OnInit, OnChanges {
  @Input() geneDisplayName;
  @Input() uniprotIdentifier = null;
  @Input() matches: Array<InterProMatch> = null;

  displayMatches = [];

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
    this.displayMatches =
      this.matches.map(match => {
        let interProEntryUrl = null;
        if (match.interpro_id) {
          interProEntryUrl = getGoXrfWithPrefix('InterPro', match.interpro_id);
        }
        let dbEntryUrl = null;
        if (match.dbname === 'GENE3D') {
          let gene3DId = match.id.replace(/^G3DSA:/, '');
          dbEntryUrl = `http://www.cathdb.info/version/latest/superfamily/${gene3DId}`;
        } else {
          dbEntryUrl = getGoXrfWithPrefix(match.dbname, match.id);
        }
        let newMatch = Object.assign({}, match);
        newMatch['interProEntryUrl'] = interProEntryUrl;
        newMatch['dbEntryUrl'] = dbEntryUrl;
        return newMatch;
      });
  }
}
