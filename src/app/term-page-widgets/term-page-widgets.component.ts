import { Component, Input } from '@angular/core';
import { faCaretDown, faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { TermIdRefs } from '../pombase-api.service';
import { SettingsService, TermPageWidget } from '../settings.service';

import '../../../node_modules/@swissprot/rhea-reaction-visualizer';

@Component({
  selector: 'app-term-page-widgets',
  templateUrl: './term-page-widgets.component.html',
  styleUrls: ['./term-page-widgets.component.css']
})
export class TermPageWidgetsComponent {
  @Input() termIdRefs: TermIdRefs;

  faCaretDown = faCaretDown;
  faCaretRight = faCaretRight;

  constructor(public settingsService: SettingsService) { }

  hasWidgetData(): boolean {
    if (!this.termIdRefs) {
      return false;
    }

    if (this.termIdRefs.definition_xrefs) {
      for (const xref of this.termIdRefs.definition_xrefs) {
         if (xref.startsWith("RHEA:")) {
          return true;
        }
      }
    }

    if (this.termIdRefs.secondary_identifiers) {
      for (const xref of this.termIdRefs.secondary_identifiers) {
        if (xref.startsWith("RHEA:")) {
          return true;
        }
      }
    }

    return false;
  }

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
}
