import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { faCaretDown, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { AppConfig, getAppConfig } from '../config';
import { GeneDetails, PombaseAPIService } from '../pombase-api.service';
import { SettingsService } from '../settings.service';
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
  sanitizedAlphaFoldURL?: SafeResourceUrl;

  constructor(private pombaseApiService: PombaseAPIService,
              private sanitizer: DomSanitizer,
              public deployConfigService: DeployConfigService,
              public settingsService: SettingsService) { }

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

          const jbHalfWidth = 10000;
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

  showJBrowse(): boolean {
    return !!this.getJBrowseIFrameURL() &&
      this.settingsService.genePageMainWidget == 'genome_browser';
  }

  getJBrowseIFrameURL(): SafeResourceUrl | undefined {
    return this.sanitizedJBrowseURL;
  }

  getAlphaFoldIFrameURL(): SafeResourceUrl | undefined {
    return this.sanitizedAlphaFoldURL;
  }

  hideGenomeBrowser() {
    this.settingsService.genePageMainWidget = 'none';
  }

  showGenomeBrowser() {
    this.settingsService.genePageMainWidget = 'genome_browser';
  }

  ngOnInit(): void {

  }

  ngOnChanges(): void {
    this.setJBrowseLink();

    if (this.geneDetails.uniprot_identifier) {
      this.sanitizedAlphaFoldURL =
        this.sanitizer.bypassSecurityTrustResourceUrl('structure_view/' + this.geneDetails.uniprot_identifier);
    } else {
      this.sanitizedAlphaFoldURL = undefined;
    }
  }
}
