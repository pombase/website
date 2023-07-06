import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
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
  sanitizedJBrowseURL?: SafeResourceUrl;

  constructor(private pombaseApiService: PombaseAPIService,
              private sanitizer: DomSanitizer,
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
            `jbrowse/?loc=${chrExportId}%3A${jbStart}..${jbEnd}&tracks=${tracks}`;

          this.sanitizedJBrowseURL =
            this.sanitizer.bypassSecurityTrustResourceUrl(this.jbrowseLinkUrl + '&tracklist=0&nav=0&overview=0');
        });
    } else {
      this.jbrowseLinkUrl = undefined;
      this.sanitizedJBrowseURL = undefined;
    }
  }

  currentWidget(): GenePageWidget {
    if (this.showStructure()) {
      if (this.geneDetails.pdb_entries.length == 0 &&
          this.settingsService.genePageMainWidget == 'pdb_viewer') {
        return 'alphafold_viewer';
      }
      return this.settingsService.genePageMainWidget;
    } else {
      if (this.settingsService.genePageMainWidget == 'alphafold_viewer' ||
          this.settingsService.genePageMainWidget == 'pdb_viewer') {
        return 'genome_browser';
      } else {
        return this.settingsService.genePageMainWidget;
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

  setWidget(widget: GenePageWidget) {
    this.settingsService.genePageMainWidget = widget;
  }

  getJBrowseIFrameURL(): SafeResourceUrl | undefined {
    return this.sanitizedJBrowseURL;
  }


  ngOnInit(): void {
  }

  ngOnChanges(): void {
    this.setJBrowseLink();
  }
}
