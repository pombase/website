import { Component, OnInit, Input,
         Inject, HostListener } from '@angular/core';
import { getAppConfig, AppConfig } from '../../config';

@Component({
    selector: 'app-page-contents-menu',
    templateUrl: './page-contents-menu.component.html',
    styleUrls: ['./page-contents-menu.component.css'],
    standalone: false
})
export class PageContentsMenuComponent implements OnInit {
  @Input() title: string;
  @Input() titleRoute: string;

  appConfig: AppConfig = getAppConfig();
  siteName = this.appConfig.site_name;
  smallLogoFileName = getAppConfig().small_logo_file_name;

  menuPositionFixed = false;

  scrollToPageTop(): void {
    this.window.scrollTo(0, 0);
  }

  constructor(@Inject('Window') private window: any) { }

  @HostListener('window:scroll', ['$event'])
  scrollEvent(_: any) {
    if (this.title === 'News' || this.title === 'Documentation') {
      this.menuPositionFixed = false;
      return;
    }

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
}
