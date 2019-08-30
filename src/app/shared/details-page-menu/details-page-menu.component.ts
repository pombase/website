import { Component, OnInit, Input, OnChanges,
         Inject, HostListener } from '@angular/core';

import { getAnnotationTableConfig, AnnotationTableConfig, getAppConfig, AppConfig} from '../../config';

interface MenuItem {
  id: string;
  displayName: string;
}

@Component({
  selector: 'app-details-page-menu',
  templateUrl: './details-page-menu.component.html',
  styleUrls: ['./details-page-menu.component.css']
})
export class DetailsPageMenuComponent implements OnInit, OnChanges {
  @Input() title: string;
  @Input() visibleSections: Array<string> = [];
  @Input() extraSections: Array<{ displayName: string; id: string }> = [];

  menuItems: Array<MenuItem> = [];
  config: AnnotationTableConfig = getAnnotationTableConfig();

  appConfig: AppConfig = getAppConfig();
  siteName = this.appConfig.site_name;

  menuPositionFixed = false;

  scrollToPageTop(): void {
    this.window.scrollTo(0, 0);
  }

  constructor(@Inject('Window') private window: any) { }

  @HostListener('window:scroll', ['$event'])
  scrollEvent(event: any) {
    if (typeof(document) !== 'undefined') {
      // see: http://stackoverflow.com/questions/28633221/document-body-scrolltop-firefox-returns-0-only-js
      let scrollingElement = document.scrollingElement || document.documentElement;

      if (scrollingElement.scrollTop >= 115) {
        this.menuPositionFixed = true;
      } else {
        this.menuPositionFixed = false;
      }
    } else {
      this.menuPositionFixed = false;
    }
  }

  ngOnInit() {
  }

  private upperCaseIntial(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  ngOnChanges() {
    if (this.visibleSections) {
      this.menuItems =
        this.visibleSections.map(typeName => {
          let typeConfig = this.config.getAnnotationType(typeName);
          return {
            id: typeName,
            displayName: typeConfig.display_name || this.upperCaseIntial(typeName),
          };
        });
      this.menuItems.push(...this.extraSections);
    } else {
      this.menuItems = [];
    }
  }
}
