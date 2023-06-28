import { Component, Input, OnChanges } from '@angular/core';
import { TermIdRefs } from '../pombase-api.service';
import { AppConfig, getAppConfig } from '../config';

@Component({
  selector: 'app-reaction-view',
  templateUrl: './reaction-view.component.html',
  styleUrls: ['./reaction-view.component.css']
})
export class ReactionViewComponent implements OnChanges {
  @Input() termIdRefs: TermIdRefs;
  @Input() miniView = false;

  rheaData: Array<{ rheaId: string, link?: string }> = [];

  appConfig: AppConfig = getAppConfig();

  setRheaData() {
    this.rheaData = [];

    const process = (xrefs: Array<string>) => {
      xrefs.map((xref: string) => {
        if (xref.startsWith('RHEA:')) {
          const rheaId = xref.substring(5);

          if (!this.rheaData.find((d) => d.rheaId == rheaId)) {
            let xrfDetails = getAppConfig().getExternalTermLink('RHEA', xref);
            let link = xrfDetails?.url;

            this.rheaData.push({ rheaId, link });
          }
        }
      });
    }

    if (this.termIdRefs.definition_xrefs) {
      process(this.termIdRefs.definition_xrefs);
    }

    if (this.termIdRefs.secondary_identifiers) {
      process(this.termIdRefs.secondary_identifiers);
    }
  }

  ngOnChanges() {
    this.setRheaData();
  }
}
