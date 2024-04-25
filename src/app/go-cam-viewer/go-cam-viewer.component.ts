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

  hasGoCam = false;

  constructor(private sanitizer: DomSanitizer) {
  }

  getIFrameURL(): SafeResourceUrl | undefined {
    return this.sanitizedURL;
  }

  ngOnChanges(): void {
    if (this.geneDetails.name) {
      this.geneDisplayName = this.geneDetails.name;
    } else {
      this.geneDisplayName = this.geneDetails.uniquename;
    }

    this.hasGoCam = this.geneDetails.gocam_ids &&
      this.geneDetails.gocam_ids.length > 0;

    if (this.geneDetails.uniprot_identifier) {
      const rawUrl = 'gocam_viz/widget/' + this.geneDetails.uniquename;
      this.sanitizedURL =
        this.sanitizer.bypassSecurityTrustResourceUrl(rawUrl);
    } else {
      this.sanitizedURL = undefined;
    }
  }


}
