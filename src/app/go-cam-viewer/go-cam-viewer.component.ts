import { Component, Input } from '@angular/core';
import { GeneDetails, GoCamIdAndTitle, TermDetails } from '../pombase-api.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-go-cam-viewer',
  templateUrl: './go-cam-viewer.component.html',
  styleUrls: ['./go-cam-viewer.component.css']
})
export class GoCamViewerComponent {
  @Input() geneOrTermDetails: GeneDetails|TermDetails;

  sanitizedURL?: SafeResourceUrl

  displayName?: string;
  currentGoCamId?: string;
  largeViewPath?: string;
  gocams: Array<GoCamIdAndTitle> = [];
  hasGoCam = false;

  constructor(private sanitizer: DomSanitizer) {
  }

  getIFrameURL(): SafeResourceUrl | undefined {
    return this.sanitizedURL;
  }

  isGenePage(): boolean {
    return this.geneOrTermDetails instanceof GeneDetails;
  }

  modelChange() {
    this.largeViewPath = '/gocam/';

    const geneOrTermDetails = this.geneOrTermDetails;

    if (geneOrTermDetails instanceof GeneDetails) {
      this.largeViewPath += 'gene/' + this.currentGoCamId + '/' + geneOrTermDetails.uniquename;
      if (this.geneOrTermDetails.name) {
        this.largeViewPath += '/' + this.geneOrTermDetails.name;
      }
    } else {
      if (geneOrTermDetails instanceof TermDetails) {
        this.largeViewPath += 'term/' + this.currentGoCamId + '/' + geneOrTermDetails.termid + '/' +
          geneOrTermDetails.name;
      }
    }

    const rawUrl = 'gocam_viz/widget/' + this.currentGoCamId;
    this.sanitizedURL =
      this.sanitizer.bypassSecurityTrustResourceUrl(rawUrl);
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
