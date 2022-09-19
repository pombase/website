import { Component, OnInit, Input, OnChanges,
         Inject, HostListener } from '@angular/core';

import { getAnnotationTableConfig, AnnotationTableConfig, getAppConfig, AppConfig} from '../../config';

interface MenuItem {
  id: string;
  displayName: string;
  subItems?: Array<MenuItem>;
  subItemsVisible?: boolean;
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
  smallLogoFileName = getAppConfig().small_logo_file_name;

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

  clicked(menuItem: MenuItem): void {
    const currentItemValue = menuItem.subItemsVisible;
    this.menuItems.map(item => {
      item.subItemsVisible = false;
    });
    menuItem.subItemsVisible = !currentItemValue;
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
          if (typeName === 'jbrowse_tracks') {
            return {
              id: typeName,
              displayName: 'JBrowse tracks',
              subItemsVisible: false,
            };
          }
          let typeConfig = this.config.getAnnotationType(typeName);
          let subItems: Array<MenuItem>|undefined;

          if (typeConfig.split_by_parents) {
            subItems = typeConfig.split_by_parents.map(splitByConf => {
              return {
                id: typeName + '-' + splitByConf.config_name,
                displayName: splitByConf.display_name,
                subItems: undefined,
              };
            });
          }

          return {
            id: typeName,
            displayName: typeConfig.display_name || this.upperCaseIntial(typeName),
            subItems,
          };
        });
      this.menuItems.push(...this.extraSections);
    } else {
      this.menuItems = [];
    }
  }
}
