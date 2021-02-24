import { Component, OnInit, OnChanges, Input } from '@angular/core';

import { GeneDetails, ProteinDetails, TranscriptDetails, TermAnnotation } from '../pombase-api.service';

import { getAppConfig } from '../config';

@Component({
  selector: 'app-protein-features',
  templateUrl: './protein-features.component.html',
  styleUrls: ['./protein-features.component.css']
})
export class ProteinFeaturesComponent implements OnInit, OnChanges {
  @Input() geneDetails: GeneDetails;

  appConfig = getAppConfig();
  siteName = this.appConfig.site_name;

  ensemblImageUrl?: string;
  ensemblBrowserUrl?: string;
  transcriptDetails?: TranscriptDetails;
  proteinDetails?: ProteinDetails;
  proteinFeaturesTable?: Array<TermAnnotation>;
  soAnnotationTable?: Array<TermAnnotation>;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.geneDetails.transcripts.length > 0) {
      this.transcriptDetails = this.geneDetails.transcripts[0];
      this.proteinDetails = this.transcriptDetails.protein;
    } else {
      this.transcriptDetails = undefined;
      this.proteinDetails = undefined;
    }

    if (this.geneDetails.cv_annotations['PomBase family or domain']) {
      this.proteinFeaturesTable =
        this.geneDetails.cv_annotations['PomBase family or domain'];
    } else {
      this.proteinFeaturesTable = undefined;
    }

    if (this.geneDetails.cv_annotations['sequence']) {
      this.soAnnotationTable =
        this.geneDetails.cv_annotations['sequence'];
    } else {
      this.soAnnotationTable = undefined;
    }

    if (this.geneDetails.feature_type !== 'pseudogene' &&
        this.transcriptDetails && this.transcriptDetails.uniquename &&
        this.appConfig.missingBrowserImages.indexOf(this.geneDetails.uniquename) === -1) {
      this.ensemblImageUrl = `/browser_images/${this.transcriptDetails.uniquename}_pep.png`;
      this.ensemblBrowserUrl =
        `http://fungi.ensembl.org/Schizosaccharomyces_pombe/Transcript/ProteinSummary?;t=${this.transcriptDetails.uniquename}`;
    } else {
      this.ensemblImageUrl = undefined;
      this.ensemblBrowserUrl = undefined;
    }
  }
}
