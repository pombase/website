import { Component, OnInit, OnChanges, Input } from '@angular/core';

import { PombaseAPIService, InterProMatch } from '../pombase-api.service';
import { getXrfWithPrefix } from '../config';

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
  apiError = null;

  constructor(private pombaseApiService: PombaseAPIService) { }

  ngOnInit() {
  }

  ngOnChanges() {
    let displayMatches =
      this.matches.map(match => {
        let newId = match.id;
        let interProEntryUrl = null;
        if (match.interpro_id) {
          interProEntryUrl = getXrfWithPrefix('InterPro', match.interpro_id);
        }
        let dbEntryUrl = null;
        if (match.dbname === 'MOBIDBLT') {
          newId = newId + ':' + this.uniprotIdentifier;
          dbEntryUrl = `http://mobidb.bio.unipd.it/entries/${this.uniprotIdentifier}`;
        } else {
          dbEntryUrl = getXrfWithPrefix(match.dbname, match.id);
        }
        let newMatch = Object.assign({}, match);
        newMatch['id'] = newId;
        newMatch['interProEntryUrl'] = interProEntryUrl;
        newMatch['dbEntryUrl'] = dbEntryUrl;
        return newMatch;
      });

    this.displayMatches = displayMatches;

    this.pombaseApiService.getGeneSubsets()
      .then(subsets => {
        for (let match of displayMatches) {
          match['geneCount'] = '';
          if (match.interpro_id) {
            let subset = subsets['interpro:' + match.interpro_id];
            if (subset) {
              match['geneCount'] = subset.elements.length;
            }
          }
        }
      })
      .catch(error => {
        this.apiError = error;
      });
  }
}
