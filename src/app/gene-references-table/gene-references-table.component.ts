import { Component, Input, OnInit, OnChanges } from '@angular/core';

import { ReferenceShort, GeneDetails } from '../pombase-api.service';
import { getAppConfig } from '../config';

@Component({
  selector: 'app-gene-references-table',
  templateUrl: './gene-references-table.component.html',
  styleUrls: ['./gene-references-table.component.css']
})
export class GeneReferencesTableComponent implements OnInit, OnChanges {
  @Input() geneDetails: GeneDetails;
  @Input() references: Array<ReferenceShort>;

  orderByField = '+authors_abbrev';

  pubmedSearchUrl?: string;
  pubmedSearchGeneLabel?: string;

  appConfig = getAppConfig();

  setOrderBy(field: string) {
    this.orderByField = field;
  }

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
    this.pubmedSearchGeneLabel = this.geneDetails.name || this.geneDetails.uniquename;

    let idList = [this.geneDetails.uniquename];

    if (this.geneDetails.name) {
      idList.push(this.geneDetails.name);
    }

    this.geneDetails.synonyms
      .filter((synonym) => synonym.type !== 'obsolete_name')
      .map((synonym) => {
        idList.push(synonym.name);
      });

    let joinedIds = idList.join(' OR ');

    if (this.appConfig.isConfigOrganism(this.geneDetails.taxonid)) {
      this.pubmedSearchUrl =
        `http://www.ncbi.nlm.nih.gov/sites/entrez?cmd=Search&db=pubmed&term=(${joinedIds}) AND (pombe OR fission yeast)`;
    } else {
      this.pubmedSearchUrl = undefined;
    }
  }
}
