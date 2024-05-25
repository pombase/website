import { Component, Input } from '@angular/core';
import { faCaretDown, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { TermDetails } from '../pombase-api.service';
import { SettingsService, TermPageWidget } from '../settings.service';

import '../../../node_modules/@swissprot/rhea-reaction-visualizer';
import { DeployConfigService } from '../deploy-config.service';

@Component({
  selector: 'app-term-page-widgets',
  templateUrl: './term-page-widgets.component.html',
  styleUrls: ['./term-page-widgets.component.css']
})
export class TermPageWidgetsComponent {
  @Input() termDetails: TermDetails;

  faCaretDown = faCaretDown;
  faCaretRight = faCaretRight;

  constructor(public settingsService: SettingsService,
              public deployConfigService: DeployConfigService) { }

  hasWidgetData(): boolean {
    if (!this.termDetails) {
      return false;
    }

    if (this.hasReactionData()) {
      return true;
    }

    if (this.hasGoCams()) {
      return true;
    }

    return false;
  }

  hasReactionData(): boolean {
    if (this.termDetails.definition_xrefs) {
      for (const xref of this.termDetails.definition_xrefs) {
        if (xref.startsWith("RHEA:")) {
          return true;
        }
      }
    }

    if (this.termDetails.secondary_identifiers) {
      for (const xref of this.termDetails.secondary_identifiers) {
        if (xref.startsWith("RHEA:")) {
          return true;
        }
      }
    }

    return false;
  }

  hasGoCams(): boolean {
    return this.termDetails.gocam_ids.length > 0 && !this.deployConfigService.productionMode();
  }

  currentWidget(): TermPageWidget {
    let current = this.settingsService.termPageMainWidget;

    if (current == 'none') {
      return 'none';
    }

    if (current == 'gocam_viewer') {
      if (this.hasGoCams()) {
        return 'gocam_viewer';
      } else {
        return 'rhea_reaction';
      }
    }

    if (current == 'rhea_reaction') {
      if (this.hasReactionData()) {
        return 'rhea_reaction';
      } else {
        return 'gocam_viewer';
      }
    }

    return current;
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
}
