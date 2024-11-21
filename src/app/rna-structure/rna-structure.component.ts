import { Component, Input, OnChanges } from '@angular/core';
import { GeneDetails } from '../pombase-api.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
    selector: 'app-rna-structure',
    templateUrl: './rna-structure.component.html',
    styleUrls: ['./rna-structure.component.css'],
    standalone: false
})
export class RnaStructureComponent implements OnChanges {
  @Input() geneDetails: GeneDetails;

  sanitizedURL?: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) {
  }

  getIFrameURL(): SafeResourceUrl | undefined {
    return this.sanitizedURL;
  }

  ngOnChanges(): void {
    if (this.geneDetails.rnacentral_urs_identifier) {
      const rawUrl = 'rna_2d_structure/' + this.geneDetails.uniquename + '/' +
        this.geneDetails.rnacentral_urs_identifier;
      this.sanitizedURL =
        this.sanitizer.bypassSecurityTrustResourceUrl(rawUrl);
    } else {
      this.sanitizedURL = undefined;
    }
  }
}
