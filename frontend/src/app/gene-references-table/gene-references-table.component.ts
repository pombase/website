import { Component, Input, OnInit, OnChanges } from '@angular/core';

import { ReferenceShort, GeneDetails } from '../pombase-api.service';

@Component({
  selector: 'app-gene-references-table',
  templateUrl: './gene-references-table.component.html',
  styleUrls: ['./gene-references-table.component.css']
})
export class GeneReferencesTableComponent implements OnInit, OnChanges {
  @Input() geneDetails: GeneDetails;
  @Input() references: Array<ReferenceShort>;

  orderByField = '+authors_abbrev';

  pubmedSearchUrl = null;
  pubmedSearchGeneLabel = null;

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
    this.pubmedSearchUrl =
      `http://www.ncbi.nlm.nih.gov/sites/entrez?cmd=Search&db=pubmed&term=(${joinedIds}) AND (pombe OR fission yeast)`;
  }
}
