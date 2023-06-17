import { Component, Input } from '@angular/core';
import { faCaretDown, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { AppConfig, getAppConfig } from '../config';
import { TermDetails } from '../pombase-api.service';
import { SettingsService, TermPageWidget } from '../settings.service';

import '../../../node_modules/@swissprot/rhea-reaction-visualizer';

@Component({
  selector: 'app-term-page-widgets',
  templateUrl: './term-page-widgets.component.html',
  styleUrls: ['./term-page-widgets.component.css']
})
export class TermPageWidgetsComponent {
  @Input() termDetails: TermDetails;

  faCaretDown = faCaretDown;
  faCaretRight = faCaretRight;

  appConfig: AppConfig = getAppConfig();

  rheaData: Array<{ rheaId: string, link?: string }> = [];

  constructor(public settingsService: SettingsService) { }

  currentWidget(): TermPageWidget {
    return this.settingsService.termPageMainWidget;
  }

  showRheaReaction(): boolean {
    return this.settingsService.termPageMainWidget === 'rhea_reaction';
  }

  hideAllWidgets() {
    this.settingsService.termPageMainWidget = 'none';
  }

  setWidget(widget: TermPageWidget) {
    this.settingsService.termPageMainWidget = widget;
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

            this.rheaData.push({ rheaId, link });
          }
        }
      });
    }

    if (this.termDetails.definition_xrefs) {
      process(this.termDetails.definition_xrefs);
    }

    if (this.termDetails.secondary_identifiers) {
      process(this.termDetails.secondary_identifiers);
    }
  }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    this.setRheaData();
  }
}
