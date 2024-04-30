import { Component, Input } from '@angular/core';
import { GeneDetails } from '../pombase-api.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-go-cam-viewer',
  templateUrl: './go-cam-viewer.component.html',
  styleUrls: ['./go-cam-viewer.component.css']
})
export class GoCamViewerComponent {
  @Input() geneDetails: GeneDetails;

  sanitizedURL?: SafeResourceUrl

  geneDisplayName?: string;
  currentGoCamId?: string;
  largeViewPath?: string;
  goCamIds: Array<string> = [];
  hasGoCam = false;

  constructor(private sanitizer: DomSanitizer) {
  }

  getIFrameURL(): SafeResourceUrl | undefined {
    return this.sanitizedURL;
  }

  modelChange() {
    this.largeViewPath = '/gocam/' + this.currentGoCamId + '/' + this.geneDetails.uniquename;

    if (this.geneDetails.name) {
      this.largeViewPath += '/' + this.geneDetails.name;
    }

    const rawUrl = 'gocam_viz/widget/' + this.currentGoCamId;
    this.sanitizedURL =
      this.sanitizer.bypassSecurityTrustResourceUrl(rawUrl);
  }

  ngOnChanges(): void {
    if (this.geneDetails.name) {
      this.geneDisplayName = this.geneDetails.name;
    } else {
      this.geneDisplayName = this.geneDetails.uniquename;
    }

    this.goCamIds = this.geneDetails.gocam_ids;

    this.hasGoCam = this.goCamIds.length > 0;

    if (!this.hasGoCam) {
      return;
    }

    this.currentGoCamId = this.goCamIds[0];

    this.modelChange();
  }
}
