import { Component, OnChanges, Input } from '@angular/core';

import { getAppConfig, ExternalGeneReference,
         getXrfWithPrefix } from '../config';
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
    let url = extRefConf.url;
    let fieldName = extRefConf.field_name;
    if (url) {
      if (fieldName === 'NCBI_ALL_IDS') {
        return [this.geneDetails.name || this.geneDetails.uniquename,
                url.replace(/<<IDENTIFIER>>/, this.getAllIds().join('+OR+'))];
      } else {
        let fieldValue = this.geneDetails[fieldName];
        if (fieldValue) {
          return [fieldValue, url.replace('<<IDENTIFIER>>', fieldValue)];
        } else {
          return [];
        }
      }
    } else {
      let go_xrf_abbrev = extRefConf.go_xrf_abbrev;
      if (go_xrf_abbrev) {
        let fieldValue = this.geneDetails[fieldName];
        return [fieldValue, getXrfWithPrefix(go_xrf_abbrev, fieldValue)];
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
      let confFeatureTypes = extRefConf.feature_types;
      if (confFeatureTypes.indexOf('ALL') === -1 &&
          extRefConf.feature_types.indexOf(this.geneDetails.feature_type) === -1) {
        continue;
      }
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
