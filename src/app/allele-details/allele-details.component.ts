import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute, Params } from '@angular/router';
import { AppConfig, getAppConfig } from '../config';
import { AlleleDetails, APIError, GenotypeShort, PombaseAPIService } from '../pombase-api.service';
import { Util } from '../shared/util';

interface DisplayGenotype {
  genotypeShort: GenotypeShort;
  displayName: string;
 }

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
  synonymString: string;
  singleLocusGenotypes: Array<DisplayGenotype> = [];
  multiLocusGenotypes: Array<DisplayGenotype> = [];
  geneDisplayName = '';


  constructor(private pombaseApiService: PombaseAPIService,
              private route: ActivatedRoute,
              private titleService: Title,
              private readonly meta: Meta) { }

  makeGenotypes() {
    this.singleLocusGenotypes = [];
    this.multiLocusGenotypes = [];

    for (const genotype of this.alleleDetails.genotypes) {
      const displayGenotype = {
        genotypeShort: genotype,
        displayName: this.genotypeDisplayName(genotype),
      };

      if (genotype.loci.length == 1) {
        this.singleLocusGenotypes.push(displayGenotype);
      } else {
        this.multiLocusGenotypes.push(displayGenotype);
      }
    }
  }

  genotypeDisplayName(genotype: GenotypeShort): string {
    return Util.genotypeDisplayName(genotype);
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
            this.synonymString = alleleDetails.synonyms.map(s => s.name).join(', ');
            this.makeGenotypes();
            this.apiError = undefined;
            this.geneDisplayName = alleleDetails.gene.name || alleleDetails.gene.uniquename;
          })
          .catch(error => {
            this.apiError = error;
          });
      };
    });
  }
}
