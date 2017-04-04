import { Component, OnChanges, Input } from '@angular/core';

import { getAppConfig, AppConfig, ExternalGeneReference,
         getGoXrfWithPrefix } from '../config';
import { GeneDetails } from '../pombase-api.service';

@Component({
  selector: 'app-gene-external-references',
  templateUrl: './gene-external-references.component.html',
  styleUrls: ['./gene-external-references.component.css']
})
export class GeneExternalReferencesComponent implements OnChanges {
  @Input() geneDetails: GeneDetails;

  allIds = [];
  table = [];
  appConfig = getAppConfig();

  constructor() { }

  getAllIds(): Array<string> {
    let ret = [this.geneDetails.uniquename];
    if (this.geneDetails.name) {
      ret.push(this.geneDetails.name);
    }

    for (let synonym of this.geneDetails.synonyms) {
      if (synonym['type'] === 'exact') {
        ret.push(synonym.name);
      }
    }

    return ret;
  }

  makeUrl(extRefConf: ExternalGeneReference): Array<string> {
    let component = this;
    let url = extRefConf.url;
    if (url) {
      let matches = url.match(/<<(uniquename|name|uniprot_identifier|orfeome_identifier|NCBI_ALL_IDS)>>/);
      if (matches) {
        let fieldName = matches[1];
        if (fieldName === 'NCBI_ALL_IDS') {
          return [this.geneDetails.name || this.geneDetails.uniquename,
                  url.replace(/<<NCBI_ALL_IDS>>/, this.getAllIds().join('+OR+'))]
        } else {
          let fieldName = matches[1];
          let identifier = this.geneDetails[fieldName];
          if (identifier) {
            return [identifier, url.replace(`<<${fieldName}>>`, identifier)];
          } else {
            return [];
          }
        }
      }
    } else {
      let go_xrf_abbrev = extRefConf.go_xrf_abbrev;
      if (go_xrf_abbrev) {
        return [];
      } else {
        return [];
      }
    }
  }

  ngOnChanges() {
    this.allIds = this.getAllIds();

    this.table = [];

    for (let extRefConf of this.appConfig.externalGeneReferences) {
      let link = this.makeUrl(extRefConf);
      if (link.length > 0) {
        let row = {
          refType: extRefConf.ref_type,
          name: extRefConf.name,
          description: extRefConf.description,
          linkLabel: link[0],
          url: link[1],
        };
        this.table.push(row);
      }
    }
  }
}
