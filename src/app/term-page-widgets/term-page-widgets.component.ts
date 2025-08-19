import { Component, Input } from '@angular/core';
import { faCaretDown, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { TermDetails } from '../pombase-api.service';
import { SettingsService, TermPageWidget } from '../settings.service';

@Component({
    selector: 'app-term-page-widgets',
    templateUrl: './term-page-widgets.component.html',
    styleUrls: ['./term-page-widgets.component.css'],
    standalone: false
})
export class TermPageWidgetsComponent {
  @Input() termDetails: TermDetails;

  faCaretDown = faCaretDown;
  faCaretRight = faCaretRight;

  constructor(public settingsService: SettingsService) { }

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
    return this.termDetails.gocams.length > 0;
  }

  currentWidget(): TermPageWidget {
    let current = this.settingsService.termPageMainWidget;

    if (current == 'gocam_viewer' && !this.hasGoCams()) {
      current = 'rhea_reaction';
    }

    if ((current == 'rhea_reaction' || current == 'rhea_atommap') &&
        !this.hasReactionData()) {
      if (this.hasGoCams()) {
        current = 'gocam_viewer';
      } else {
        current = 'none';
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
