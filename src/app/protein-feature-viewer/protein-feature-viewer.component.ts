import { Component, Input } from '@angular/core';
import { GeneDetails } from '../pombase-api.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-protein-feature-viewer',
  templateUrl: './protein-feature-viewer.component.html',
  styleUrls: ['./protein-feature-viewer.component.css']
})
export class ProteinFeatureViewerComponent {
  @Input() geneDetails: GeneDetails;

  sanitizedURL?: SafeResourceUrl;

  geneDisplayName?: string;

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

    const rawUrl = 'protein_feature_view/widget/' + this.geneDetails.uniquename;
    this.sanitizedURL =
      this.sanitizer.bypassSecurityTrustResourceUrl(rawUrl);
  }
}
