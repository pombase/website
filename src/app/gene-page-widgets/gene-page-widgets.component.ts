import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { faCaretDown, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { AppConfig, getAppConfig } from '../config';
import { GeneDetails, PombaseAPIService } from '../pombase-api.service';
import { GenePageWidget, SettingsService } from '../settings.service';
import { DeployConfigService } from '../deploy-config.service';

@Component({
  selector: 'app-gene-page-widgets',
  templateUrl: './gene-page-widgets.component.html',
  styleUrls: ['./gene-page-widgets.component.css']
})
export class GenePageWidgetsComponent implements OnInit, OnChanges {
  @Input() geneDetails: GeneDetails;

  faCaretDown = faCaretDown;
  faCaretRight = faCaretRight;

  appConfig: AppConfig = getAppConfig();
  jbrowseLinkUrl?: string;

  constructor(private pombaseApiService: PombaseAPIService,
              public settingsService: SettingsService,
              public deployConfigService: DeployConfigService) { }

  setJBrowseLink(): void {
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
        });
    } else {
      this.jbrowseLinkUrl = undefined;
    }
  }

  currentWidget(): GenePageWidget {
    let current = this.settingsService.genePageMainWidget;

    if (current == 'gocam_viewer' &&
        this.geneDetails.gocams.length == 0) {
      current = 'protein_feature_viewer';
    }

    if (this.showStructure()) {
      if (this.geneDetails.pdb_entries.length == 0 &&
        current == 'pdb_viewer') {
        return 'alphafold_viewer';
      }
      return current;
    } else {
      if (current == 'alphafold_viewer' || current == 'pdb_viewer' ||
          (!this.showProteinFeatures() && current == 'protein_feature_viewer')) {
        return 'genome_browser';
      } else {
        return current;
      }
    }
  }

  hideAllWidgets() {
    this.settingsService.genePageMainWidget = 'none';
  }

  showStructure(): boolean {
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

  showPDBStructure(): boolean {
    return this.geneDetails.pdb_entries.length > 0 && this.showStructure();
  }

  hasRna2dStructure(): boolean {
    return !!this.geneDetails.rnacentral_urs_identifier &&
      ['tRNA gene', 'snRNA gene', 'snoRNA gene', 'rRNA gene']
        .includes(this.geneDetails.feature_type);
  }

  showProteinFeatures(): boolean {
    return this.geneDetails.feature_type == "mRNA gene";
  }

  showGoCams(): boolean {
    return this.geneDetails.gocams.length > 0 && !this.deployConfigService.productionMode();
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
