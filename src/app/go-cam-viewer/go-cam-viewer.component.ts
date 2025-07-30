import { Component, Input } from '@angular/core';
import { GeneDetails, GoCamIdAndTitle, TermDetails } from '../pombase-api.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DeployConfigService } from '../deploy-config.service';

@Component({
    selector: 'app-go-cam-viewer',
    templateUrl: './go-cam-viewer.component.html',
    styleUrls: ['./go-cam-viewer.component.css'],
    standalone: false
})
export class GoCamViewerComponent {
  @Input() geneOrTermDetails: GeneDetails|TermDetails;

  sanitizedURL?: SafeResourceUrl

  displayName?: string;
  currentGoCamId?: string;
  largeViewPath?: string;
  pomBaseViewPath?: string;
  gocams: Array<GoCamIdAndTitle> = [];
  hasGoCam = false;

  constructor(private sanitizer: DomSanitizer,
              public deployConfigService: DeployConfigService) {
  }

  getIFrameURL(): SafeResourceUrl | undefined {
    return this.sanitizedURL;
  }

  isGenePage(): boolean {
    return this.geneOrTermDetails instanceof GeneDetails;
  }

  modelChange() {
    this.largeViewPath = '/gocam/pombase-view/';
    this.pomBaseViewPath = '/gocam/pombase-view/';

    const geneOrTermDetails = this.geneOrTermDetails;

    let restOfUrl = '';
    let restOfWidgetUrl = '';

    if (geneOrTermDetails instanceof GeneDetails) {
      restOfUrl += 'gene/' + this.currentGoCamId + '/' + geneOrTermDetails.uniquename;
      restOfWidgetUrl = '/' + geneOrTermDetails.uniquename
      if (this.geneOrTermDetails.name) {
        restOfUrl += '/' + this.geneOrTermDetails.name;
      }
    } else {
      if (geneOrTermDetails instanceof TermDetails) {
        restOfUrl += 'term/' + this.currentGoCamId + '/' + geneOrTermDetails.termid + '/' +
          geneOrTermDetails.name;
      }
    }

    this.largeViewPath += restOfUrl;
    this.pomBaseViewPath += restOfUrl;

    const rawUrl = 'gocam_view/widget/' + this.currentGoCamId + restOfWidgetUrl;
    this.sanitizedURL =
      this.sanitizer.bypassSecurityTrustResourceUrl(rawUrl);
  }

  currentGoCam(): GoCamIdAndTitle|undefined {
    for (const goCam of this.gocams) {
      if (goCam.gocam_id == this.currentGoCamId!) {
        return goCam;
      }
    }

    return undefined;
  }

  ngOnChanges(): void {
    const geneOrTermDetails = this.geneOrTermDetails;
    if (geneOrTermDetails instanceof GeneDetails) {
      if (geneOrTermDetails.name) {
        this.displayName = geneOrTermDetails.name;
      } else {
        this.displayName = geneOrTermDetails.uniquename;
      }
    } else {
      if (geneOrTermDetails instanceof TermDetails) {
        this.displayName = geneOrTermDetails.name + '(' + geneOrTermDetails.termid + ')';
      }
    }

    this.gocams = this.geneOrTermDetails.gocams;

    this.hasGoCam = this.gocams.length > 0;

    if (!this.hasGoCam) {
      return;
    }

    this.currentGoCamId = this.gocams[0].gocam_id;

    this.modelChange();
  }
}
