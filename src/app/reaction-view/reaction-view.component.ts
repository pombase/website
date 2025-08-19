import { Component, Input, OnChanges } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TermIdRefs } from '../pombase-api.service';
import { AppConfig, getAppConfig } from '../config';

interface RheaItem {
  rheaId: string;
  link?: string;
  sanitizedURL: SafeResourceUrl;
}


@Component({
    selector: 'app-reaction-view',
    templateUrl: './reaction-view.component.html',
    styleUrls: ['./reaction-view.component.css'],
    standalone: false
})
export class ReactionViewComponent implements OnChanges {
  @Input() termIdRefs: TermIdRefs;
  @Input() miniView = false;
  @Input() viewType: 'reaction'|'atommap';

  rheaData: Array<RheaItem> = [];

  appConfig: AppConfig = getAppConfig();

  constructor(private sanitizer: DomSanitizer) {}

  public trackById(_index: number, item: RheaItem): string {
    return item.rheaId;
  }

  setRheaData() {
    this.rheaData = [];

    const process = (xrefs: Array<string>) => {
      xrefs.map((xref: string) => {
        if (xref.startsWith('RHEA:')) {
          const rheaId = xref.substring(5);

          if (!this.rheaData.find((d) => d.rheaId == rheaId)) {
            let xrfDetails = getAppConfig().getExternalTermLink('RHEA', xref);
            let link = xrfDetails?.url;


            const rawUrl = `rhea_widget/${this.viewType}/${rheaId}`;
            const sanitizedURL =
              this.sanitizer.bypassSecurityTrustResourceUrl(rawUrl);

            this.rheaData.push({ rheaId, link, sanitizedURL });
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
