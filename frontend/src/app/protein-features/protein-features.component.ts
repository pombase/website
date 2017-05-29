import { Component, OnInit, Input } from '@angular/core';

import { AnnotationTable, ProteinDetails } from '../pombase-api.service';

@Component({
  selector: 'app-protein-features',
  templateUrl: './protein-features.component.html',
  styleUrls: ['./protein-features.component.css']
})
export class ProteinFeaturesComponent implements OnInit {
  @Input() annotationTable: AnnotationTable;
  @Input() proteinDetails: ProteinDetails;

  constructor() { }

  ngOnInit() {
  }
}
