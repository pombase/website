import { Component, Input, OnInit } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { AppConfig, getAppConfig } from '../config';
import { GeneDetails } from '../pombase-api.service';

@Component({
  selector: 'app-pdb-structure-viewer',
  templateUrl: './pdb-structure-viewer.component.html',
  styleUrls: ['./pdb-structure-viewer.component.css']
})
export class PdbStructureViewerComponent implements OnInit {
  @Input() geneDetails: GeneDetails;

  appConfig: AppConfig = getAppConfig();

  sanitizedURL?: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) { }

  ngOnChanges(): void {

    if (this.geneDetails.uniprot_identifier) {
      const rawUrl = 'structure_view/pdb/' + this.geneDetails.uniprot_identifier;
      this.sanitizedURL =
        this.sanitizer.bypassSecurityTrustResourceUrl(rawUrl);
    } else {
      this.sanitizedURL = undefined;
    }
  }

  ngOnInit(): void {
  }
}
