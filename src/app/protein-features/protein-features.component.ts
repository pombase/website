import { Component, OnInit, OnChanges, Input } from '@angular/core';

import { GeneDetails, TranscriptDetails, TermAnnotation } from '../pombase-api.service';

import { getAppConfig, getXrfWithPrefix } from '../config';

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-protein-features',
  templateUrl: './protein-features.component.html',
  styleUrls: ['./protein-features.component.css']
})
export class ProteinFeaturesComponent implements OnInit, OnChanges {
  @Input() geneDetails: GeneDetails;

  appConfig = getAppConfig();
  siteName = this.appConfig.site_name;

  transcriptDetails?: TranscriptDetails;

  proteinFeaturesTable?: Array<TermAnnotation>;
  soAnnotationTable?: Array<TermAnnotation>;

  highlightedId?: string;

  sanitizedURL?: SafeResourceUrl;
  iframeHeight = 400;

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit() {
  }
  
  getIFrameURL(): SafeResourceUrl | undefined {
    return this.sanitizedURL;
  }

   getInterProUrl(): string {
     if (this.geneDetails.uniprot_identifier) {
       const xrfDetails = getXrfWithPrefix('InterProUniProtId', this.geneDetails.uniprot_identifier);
       if (xrfDetails) {
        return xrfDetails.url;
       }
     }

     return 'https://www.ebi.ac.uk/interpro/';
   }

  ngOnChanges() {
    if (this.geneDetails.transcripts.length > 0) {
      this.transcriptDetails = this.geneDetails.transcripts[0];
    } else {
      this.transcriptDetails = undefined;
    }

    if (this.geneDetails.cv_annotations['pombase_family_or_domain']) {
      this.proteinFeaturesTable =
        this.geneDetails.cv_annotations['pombase_family_or_domain'];
    } else {
      this.proteinFeaturesTable = undefined;
    }

    if (this.geneDetails.cv_annotations['sequence']) {
      this.soAnnotationTable =
        this.geneDetails.cv_annotations['sequence'];
    } else {
      this.soAnnotationTable = undefined;
    }
    
    const rawUrl = 'protein_feature_view/domains_and_features/' + this.geneDetails.uniquename;
    this.sanitizedURL =
      this.sanitizer.bypassSecurityTrustResourceUrl(rawUrl);


    if (this.iframeHeight < 200) {
      this.iframeHeight = 250;
    }
  }
}
