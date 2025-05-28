import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { faCaretDown, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { AppConfig, getAppConfig } from '../config';
import { GeneDetails, PombaseAPIService } from '../pombase-api.service';
import { GenePageWidget, SettingsService } from '../settings.service';
import { DeployConfigService } from '../deploy-config.service';

@Component({
    selector: 'app-gene-page-widgets',
    templateUrl: './gene-page-widgets.component.html',
    styleUrls: ['./gene-page-widgets.component.css'],
    standalone: false
})
export class GenePageWidgetsComponent implements OnInit, OnChanges {
  @Input() geneDetails: GeneDetails;

  faCaretDown = faCaretDown;
  faCaretRight = faCaretRight;

  appConfig: AppConfig = getAppConfig();
  jbrowseLinkUrl?: string;
  jbrowse2GeneUrl?: string;

  constructor(private pombaseApiService: PombaseAPIService,
              private deployConfigService: DeployConfigService,
              public settingsService: SettingsService) { }

  setJBrowseLink(): void {
    this.jbrowse2GeneUrl = undefined;
    if (this.geneDetails && this.geneDetails.location) {
      this.pombaseApiService.getChromosomeSummaryMapPromise()
        .then(chromosomeSummaryMap => {
          const loc = this.geneDetails.location;
          const chrName = loc.chromosome_name;
          const chr = chromosomeSummaryMap[chrName];
          const chrLength = chr.length;

          const lowerPos = Math.min(loc.start_pos, loc.end_pos);
          const upperPos = Math.max(loc.start_pos, loc.end_pos);

          const mid = Math.round((lowerPos + upperPos) / 2);

          const jbHalfWidth = 8000;
          let jbStart = mid - jbHalfWidth;
          if (jbStart < 1) {
            jbStart = 1;
          }

          let jbEnd = mid + jbHalfWidth;
          if (jbEnd > chrLength) {
            jbEnd = chrLength;
          }


          const chrConfig = this.appConfig.getChromosomeConfigByName(chrName);

          let chrExportId;
          if (chrConfig) {
            chrExportId = chrConfig.export_id;
          } else {
            chrExportId = chrName;
          }

          const tracks = 'Forward%20strand%20features%2CReverse%20strand%20features%2CDNA%20sequence';
          this.jbrowseLinkUrl =
            `jbrowse/?loc=${chrExportId}%3A${jbStart}..${jbEnd}&tracks=${tracks}&tracklist=0&nav=0&overview=0`;

          if (!this.deployConfigService.productionMode()) {
            const jbrowseAssemblyName = getAppConfig().jbrowseAssemblyName;
            const jbrowseDefaultTrackIds = getAppConfig().jbrowseDefaultTrackIds;
            if (jbrowseAssemblyName && jbrowseDefaultTrackIds) {
              const trackIds = jbrowseDefaultTrackIds.join(',');
              this.jbrowse2GeneUrl =
                `/jbrowse2?loc=${chrExportId}%3A${jbStart}-${jbEnd}&highlight=${chrExportId}:${lowerPos}-${upperPos}&assembly=${jbrowseAssemblyName}&tracks=${trackIds}`;
            }
          }
        });
    } else {
      this.jbrowseLinkUrl = undefined;
    }
  }

  currentWidget(): GenePageWidget {
    let current = this.settingsService.genePageMainWidget;

    if (current == 'gocam_viewer' && this.geneDetails.gocams.length == 0) {
      current = 'protein_feature_viewer';
    }

    if (current == 'pdb_viewer' && !this.hasPDBStructure()) {
      current = 'alphafold_viewer';
    }

    if (current == 'alphafold_viewer' && !this.hasStructure()) {
      current = 'protein_feature_viewer';
    }

    if (current == 'rna_2d_structure' && !this.hasRna2dStructure()) {
      current = 'genome_browser';
    }

    if (current == 'protein_feature_viewer' && !this.showProteinFeatures()) {
      current = 'genome_browser';
    }

    return current;
  }

  hideAllWidgets() {
    this.settingsService.genePageMainWidget = 'none';
  }

  hasStructure(): boolean {
    if (!this.geneDetails.uniprot_identifier) {
      return false;
    }

    if (this.geneDetails.transcripts.length == 0) {
      return false;
    }

    const seq = this.geneDetails.transcripts[0].protein?.sequence;
    if (seq) {
      return seq.length > 0;
    } else {
      return false;
    }
  }

  hasPDBStructure(): boolean {
    return this.geneDetails.pdb_entries.length > 0;
  }

  hasRna2dStructure(): boolean {
    return !!this.geneDetails.rnacentral_2d_structure_id &&
      ['tRNA gene', 'snRNA gene', 'snoRNA gene', 'rRNA gene']
        .includes(this.geneDetails.feature_type);
  }

  showProteinFeatures(): boolean {
    return this.geneDetails.feature_type == "mRNA gene";
  }

  showGoCams(): boolean {
    return this.geneDetails.gocams.length > 0;
  }

  setWidget(widget: GenePageWidget) {
    this.settingsService.genePageMainWidget = widget;
  }

  getJBrowseIFrameURL(): string | undefined {
    return this.jbrowseLinkUrl;
  }


  ngOnInit(): void {
  }

  ngOnChanges(): void {
    this.setJBrowseLink();
  }
}
