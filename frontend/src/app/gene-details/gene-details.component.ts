import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { SynonymDetails, GeneDetails, ChromosomeLocation, PombaseAPIService } from '../pombase-api.service';

import { getAnnotationTableConfig, AnnotationTableConfig,
         getAppConfig, AppConfig } from '../config';

@Component({
  selector: 'app-gene-details',
  templateUrl: './gene-details.component.html',
  styleUrls: ['./gene-details.component.css']
})
export class GeneDetailsComponent implements OnInit {
  @Input() geneDetails: GeneDetails;

  synonymsDisplay: string = "";
  displayLocation: string = "";
  shortChromosomeName: string = "";
  annotationTypeNames: Array<string>;
  interactionAnnotationTypeNames: Array<string>;
  config: AnnotationTableConfig = getAnnotationTableConfig();
  appConfig: AppConfig = getAppConfig();

  constructor(private pombaseApiService: PombaseAPIService,
              private route: ActivatedRoute) { }

  makeDisplayLocation(location: ChromosomeLocation): string {
    let chromosome_name = location.chromosome_name;
    let matches = chromosome_name.match(/chromosome_(\d+)/);
    this.shortChromosomeName = "";
    if (matches) {
      chromosome_name = "Chromosome ";
      for (let i = 0; i < +matches[1]; i++) {
        this.shortChromosomeName += "I";
      }
      chromosome_name += this.shortChromosomeName;
    } else {
      if (chromosome_name == "mating_type_region") {
        chromosome_name = "Mating type region";
        this.shortChromosomeName = "MTR";
      } else {
        if (chromosome_name == "MISPCG") {
          chromosome_name = "Mitochondria";
          this.shortChromosomeName = "MT";
        } else {
          this.shortChromosomeName = chromosome_name;
        }
      }
    }
    let ret = chromosome_name + ", ";
    if (location.strand == "reverse") {
      ret += location.end_pos + "-" + location.start_pos;
    } else {
      ret += location.start_pos + "-" + location.end_pos;
    }
    ret += " (" + (location.end_pos - location.start_pos) + "nt)";
    return ret;
  }

  makeSynonymsDisplay(synonyms: Array<SynonymDetails>): string {
    return synonyms.map((synonym) => {
      if (synonym.type == 'exact') {
        return synonym.name;
      } else {
        let synonym_type = synonym.type;
        if (synonym_type == 'obsolete_name') {
          synonym_type = 'obsolete';
        }
        return synonym.name + " (" + synonym_type + ")";
      }
    }).join(", ");
  }

  ngOnInit(): void {
    this.annotationTypeNames = this.config.annotationTypeOrder;
    this.interactionAnnotationTypeNames = ["interacts_physically", "interacts_genetically"];
    this.route.params.forEach((params: Params) => {
      if (params['uniquename'] !== undefined) {
        let uniquename = params['uniquename'];
        this.pombaseApiService.getGene(uniquename)
          .then(geneDetails => {
            this.geneDetails = geneDetails;
            this.synonymsDisplay = this.makeSynonymsDisplay(geneDetails.synonyms);
            this.displayLocation = this.makeDisplayLocation(geneDetails.location);
          });
      };
    });
  }
}
