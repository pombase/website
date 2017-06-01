import { Component, OnInit, OnChanges, Input } from '@angular/core';

import { AnnotationTable, ProteinDetails, Organism } from '../pombase-api.service';

import { getAppConfig } from '../config';

@Component({
  selector: 'app-protein-features',
  templateUrl: './protein-features.component.html',
  styleUrls: ['./protein-features.component.css']
})
export class ProteinFeaturesComponent implements OnInit, OnChanges {
  @Input() annotationTable: AnnotationTable;
  @Input() transcriptUniquename: string;
  @Input() organism: Organism;
  @Input() proteinDetails: ProteinDetails;

  appConfig = getAppConfig();
  ensemblImageUrl = null;
  ensemblBrowserUrl = null;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
    this.ensemblImageUrl =
      `http://preview.pombase.org/browser_images/${this.transcriptUniquename}_pep.png`;
    this.ensemblBrowserUrl =
      `http://genomebrowser.pombase.org/Schizosaccharomyces_pombe/Transcript/ProteinSummary?;t=${this.transcriptUniquename}`;
  }
}
