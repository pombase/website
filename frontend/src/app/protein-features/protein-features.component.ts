import { Component, OnInit, OnChanges, Input } from '@angular/core';

import { GeneDetails } from '../pombase-api.service';

import { getAppConfig } from '../config';

@Component({
  selector: 'app-protein-features',
  templateUrl: './protein-features.component.html',
  styleUrls: ['./protein-features.component.css']
})
export class ProteinFeaturesComponent implements OnInit, OnChanges {
  @Input() geneDetails: GeneDetails;

  appConfig = getAppConfig();
  ensemblImageUrl = null;
  ensemblBrowserUrl = null;
  transcriptDetails = null;
  proteinDetails = null;
  proteinFeaturesTable = null;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.geneDetails.transcripts.length > 0) {
      this.transcriptDetails = this.geneDetails.transcripts[0];
      this.proteinDetails = this.transcriptDetails.protein;
    } else {
      this.transcriptDetails = null;
      this.proteinDetails = null;
    }

    if (this.geneDetails.cv_annotations['PomBase family or domain']) {
      this.proteinFeaturesTable =
        this.geneDetails.cv_annotations['PomBase family or domain'];
    } else {
      this.proteinFeaturesTable = null;
    }

    if (this.transcriptDetails && this.transcriptDetails.uniquename) {
      this.ensemblImageUrl =
        `http://preview.pombase.org/browser_images/${this.transcriptDetails.uniquename}_pep.png`;
      this.ensemblBrowserUrl =
        `http://fungi.ensembl.org/Schizosaccharomyces_pombe/Transcript/ProteinSummary?;t=${this.transcriptDetails.uniquename}`;
    } else {
      this.ensemblImageUrl = null;
      this.ensemblBrowserUrl = null;
    }
  }
}
