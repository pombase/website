import { Component, OnChanges, Input } from '@angular/core';

import { GeneDetails } from '../pombase-api.service';

@Component({
  selector: 'app-gene-external-references',
  templateUrl: './gene-external-references.component.html',
  styleUrls: ['./gene-external-references.component.css']
})
export class GeneExternalReferencesComponent implements OnChanges {
  @Input() geneDetails: GeneDetails;

  constructor() { }

  ngOnChanges() {

  }
}
