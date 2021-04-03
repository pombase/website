import { Component, OnInit, OnChanges, Input } from '@angular/core';

import { GeneDetails, ProteinDetails, TranscriptDetails, TermAnnotation } from '../pombase-api.service';

import { getAppConfig, getXrfConfigByName, getXrfWithPrefix } from '../config';

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

  transcriptDetails?: TranscriptDetails;
  proteinDetails?: ProteinDetails;
  proteinFeaturesTable?: Array<TermAnnotation>;
  soAnnotationTable?: Array<TermAnnotation>;
  trackViewData: Array<TrackViewTrack> = [];

  highlightedId?: string;

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
        const xrfConfig = getXrfConfigByName(dbname);
        let label;
        if (xrfConfig) {
          label = xrfConfig.displayName;
        } else {
          label = dbname;
        }
        return new TrackViewTrack(label, dbname, features);
      });
  }

  makeTrackFromCoords(trackLabel: string, dbName: string,
    partLabel: string, coords: Array<Array<number>>):
    TrackViewTrack | undefined {
    if (coords && coords.length > 0) {
      if (coords.length > 1) {
        partLabel += 's';
      }
      const parts = coords
        .map(coord => new TrackViewFeaturePart(coord[0], coord[1], false));
      const feature = new TrackViewFeature(partLabel, partLabel, parts);

      return new TrackViewTrack(trackLabel, dbName, [feature]);
    } else {
      return undefined;
    }
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

    this.trackViewData = this.makeTrackViewData();
    const tmTrack =
      this.makeTrackFromCoords('TM domains', 'TMHMM', 'predicted trans-membrane domain',
        this.geneDetails.tm_domain_coords);
    if (tmTrack) {
      this.trackViewData.push(tmTrack);
    }

    const disorderedTrack = this.makeTrackFromCoords('Disordered', 'Pfam',
      'disordered region', this.geneDetails.disordered_region_coords);
    if (disorderedTrack) {
      this.trackViewData.push(disorderedTrack);
    }

    const lowComplexityTrack = this.makeTrackFromCoords('Low complexity', 'Pfam',
      'low complexity region ', this.geneDetails.low_complexity_region_coords);
    if (lowComplexityTrack) {
      this.trackViewData.push(lowComplexityTrack);
    }

    const coiledCoilTrack = this.makeTrackFromCoords('Coiled-coils', 'ncoil',
      'coiled-coil region', this.geneDetails.coiled_coil_coords);
    if (coiledCoilTrack) {
      this.trackViewData.push(coiledCoilTrack);
    }
  }
}
