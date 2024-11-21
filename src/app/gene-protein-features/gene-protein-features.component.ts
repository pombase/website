import { Component, OnInit, Input } from '@angular/core';

import { ActivatedRoute, Params } from '@angular/router';
import { GeneDetails, PombaseAPIService } from '../pombase-api.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DeployConfigService } from '../deploy-config.service';

@Component({
    selector: 'app-gene-protein-features',
    templateUrl: './gene-protein-features.component.html',
    styleUrls: ['./gene-protein-features.component.css'],
    standalone: false
})
export class GeneProteinFeaturesComponent implements OnInit {
  @Input() geneDetails: GeneDetails;

  sanitizedURL?: SafeResourceUrl;

  featureTableVisible = false;

  constructor(private sanitizer: DomSanitizer,
              private pombaseApiService: PombaseAPIService,
              private route: ActivatedRoute,
              public deployConfigService: DeployConfigService) {
  }

  getIFrameURL(): SafeResourceUrl | undefined {
    return this.sanitizedURL;
  }

  ngOnInit(): void {
    this.route.params.forEach((params: Params) => {
      if (params['uniquename'] !== undefined) {
          const uniquename = params['uniquename'];

          this.pombaseApiService.getGene(uniquename)
            .then(geneDetails => {
              this.geneDetails = geneDetails;

              if (this.geneDetails.uniprot_identifier) {
                const rawUrl = 'protein_feature_view/full/' + this.geneDetails.uniquename;
                this.sanitizedURL = this.sanitizer.bypassSecurityTrustResourceUrl(rawUrl);
              } else {
                this.sanitizedURL = undefined;
              }
            });
      }
    })
  }
}
