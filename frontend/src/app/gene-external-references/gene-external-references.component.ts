import { Component, OnChanges, Input } from '@angular/core';

import { getAppConfig, ExternalGeneReference,
         getXrfWithPrefix, makeGeneExternalUrl} from '../config';
import { GeneDetails } from '../pombase-api.service';

interface RefRow {
  refType: string;
  name: string;
  description: string;
  linkLabel: string;
  url: string;
}

@Component({
  selector: 'app-gene-external-references',
  templateUrl: './gene-external-references.component.html',
  styleUrls: ['./gene-external-references.component.css']
})
export class GeneExternalReferencesComponent implements OnChanges {
  @Input() geneDetails: GeneDetails;

  table: Array<RefRow> = [];
  appConfig = getAppConfig();

  constructor() { }

  ngOnChanges() {
    this.table = [];

    for (let extRefConf of this.appConfig.externalGeneReferences) {
      let link = makeGeneExternalUrl(this.geneDetails, extRefConf);
      let confFeatureTypes = extRefConf.feature_types;
      if (confFeatureTypes.indexOf('ALL') === -1 &&
          extRefConf.feature_types.indexOf(this.geneDetails.feature_type) === -1) {
        continue;
      }
      if (link.length > 0) {
        let row: RefRow = {
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
