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
  selector: 'app-external-refs-table',
  templateUrl: './external-refs-table.component.html',
  styleUrls: ['./external-refs-table.component.css']
})
export class ExternalRefsTableComponent implements OnChanges {
  @Input() geneDetails: GeneDetails;
  @Input() sectionFilter: string;

  table: Array<RefRow> = [];
  extRefConfs: Array<ExternalGeneReference> = [];
  appConfig = getAppConfig();

  showTypeColumn = true;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
    this.table = [];
    this.extRefConfs = [];

    for (let extRefConf of this.appConfig.externalGeneReferences) {
      let confFeatureTypes = extRefConf.feature_types;
      if (confFeatureTypes.indexOf('ALL') === -1 &&
          extRefConf.feature_types.indexOf(this.geneDetails.feature_type) === -1) {
        continue;
      }

      if (this.sectionFilter) {
        if (!extRefConf.show_in_sections ||
            !extRefConf.show_in_sections.includes(this.sectionFilter)) {
          continue;
        }

        this.showTypeColumn = false;
      }

      this.extRefConfs.push(extRefConf);
    }

    if (this.extRefConfs) {
      for (const extRefConf of this.extRefConfs) {
        let link = makeGeneExternalUrl(this.geneDetails, extRefConf);
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
}
