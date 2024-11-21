import { Component, OnInit, Input, OnChanges,
         Inject, HostListener } from '@angular/core';

import { getAnnotationTableConfig, AnnotationTableConfig, getAppConfig, AppConfig} from '../../config';

import { MenuItem } from '../../types';

interface DisplayMenuItem extends MenuItem {
  subItemsVisible: boolean;
}

@Component({
    selector: 'app-details-page-menu',
    templateUrl: './details-page-menu.component.html',
    styleUrls: ['./details-page-menu.component.css'],
    standalone: false
})
export class DetailsPageMenuComponent implements OnInit, OnChanges {
  @Input() title: string;
  @Input() menuItems: Array<MenuItem> = [];

  displayMenuItems: Array<DisplayMenuItem> = [];

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

  clicked(menuItem: DisplayMenuItem): void {
    const currentItemValue = menuItem.subItemsVisible;
    this.displayMenuItems.map(item => {
      item.subItemsVisible = false;
    });
    menuItem.subItemsVisible = !currentItemValue;
  }

  ngOnInit() {
  }

  ngOnChanges() {
    this.displayMenuItems =
      this.menuItems.map(item => {
        let displayItem = { ...item, subItemsVisible: false };

        return displayItem;
      });
  }
}
