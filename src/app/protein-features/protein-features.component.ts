import { Component, OnInit, OnChanges, Input } from '@angular/core';

import { GeneDetails, ProteinDetails, TranscriptDetails, TermAnnotation } from '../pombase-api.service';

import { getAppConfig } from '../config';

import { TrackViewFeature, TrackViewFeaturePart, TrackViewTrack } from '../track-view-track';

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
  trackViewData: Array<TrackViewTrack> = [];

  constructor() { }

  ngOnInit() {
  }

  makeTrackViewData(): Array<TrackViewTrack> {
    let featuresByDbname: {[dbname: string]: Array<TrackViewFeature>;} = {}

    this.geneDetails.interpro_matches
      .map(match => {
        const parts = [];
        for (let i = 0; i < match.locations.length; i++) {
          const loc = match.locations[i];
          parts.push(new TrackViewFeaturePart(loc.start, loc.end, false));
          if (i < match.locations.length - 1) {
            const nextLoc = match.locations[i+1];
            const paddStart = loc.end + 1;
            const paddEnd = nextLoc.start - 1;
            // cope with overlapping locations in the match
            if (paddStart < paddEnd) {
              parts.push(new TrackViewFeaturePart(paddStart, paddEnd, true));
            }
          }
        }
        const feature = new TrackViewFeature(match.id, match.interpro_name || match.name, parts);
        if (!featuresByDbname[match.dbname]) {
          featuresByDbname[match.dbname] = [];
        }
        featuresByDbname[match.dbname].push(feature);
      });

    return Object.keys(featuresByDbname)
      .map(dbname => {
        const features = featuresByDbname[dbname];
        return new TrackViewTrack(dbname, dbname, features);
      });
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

    this.trackViewData = this.makeTrackViewData();
  }
}
