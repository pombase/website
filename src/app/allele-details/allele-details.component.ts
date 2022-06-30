import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, getAppConfig } from '../config';
import { AlleleDetails, APIError, GenotypeShort, PombaseAPIService } from '../pombase-api.service';
import { Util } from '../shared/util';

@Component({
  selector: 'app-allele-details',
  templateUrl: './allele-details.component.html',
  styleUrls: ['./allele-details.component.css']
})
export class AlleleDetailsComponent implements OnInit {
  alleleDetails: AlleleDetails;

  displayName = '';
  displayNameForTitle = '';
  apiError?: APIError;
  appConfig: AppConfig = getAppConfig();
  hasSynonyms = false;
  genotypes: Array<{ genotypeShort: GenotypeShort, displayName: string }> = [];

  constructor(private pombaseApiService: PombaseAPIService,
              private route: ActivatedRoute,
              private titleService: Title,
              private readonly meta: Meta) { }

  makeGenotypes() {
    this.genotypes =
      this.alleleDetails.genotypes.map(genotype => {
        return {
          genotypeShort: genotype,
          displayName: this.genotypeDisplayName(genotype),
        };
      });

    this.genotypes.sort((a, b) => {
      return a.displayName.localeCompare(b.displayName);
    });
  }

  genotypeDisplayName(genotype: GenotypeShort): string {
    return Util.displayNameLong(genotype);
  }

  displayNameLong(): string {
    return Util.alleleDisplayName(this.alleleDetails);
  }

  setDisplayName(): void {
    const displayName = this.displayNameLong();
    this.displayNameForTitle = displayName;
    this.displayName = displayName.replace(/,/g, ',&thinsp;');

    if (this.displayNameForTitle.length > 105) {
      this.displayNameForTitle = this.displayNameForTitle.substr(0, 100) + ' ...';
    }
  }

  setPageTitle(): void {
    const title = this.appConfig.site_name + ' - Genotype - ' +
      this.displayNameForTitle;
    this.titleService.setTitle(title);
    this.meta.updateTag({property: 'og:title', content: title});
    this.meta.updateTag({property: 'description', content: title});
  }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      if (params['uniquename'] !== undefined) {
        let uniquename = params['uniquename'];
        this.pombaseApiService.getAllele(uniquename)
          .then(alleleDetails => {
            this.alleleDetails = alleleDetails;
            this.setDisplayName();
            this.setPageTitle();
            this.hasSynonyms = alleleDetails.synonyms.length > 0;
            this.makeGenotypes();
            this.apiError = undefined;
          })
          .catch(error => {
            this.apiError = error;
          });
      };
    });
  }
}
