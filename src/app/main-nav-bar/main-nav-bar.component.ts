import { Component, OnInit } from '@angular/core';

import { getAppConfig, NavBarEntry } from '../config';

@Component({
    selector: 'app-main-nav-bar',
    templateUrl: './main-nav-bar.component.html',
    styleUrls: ['./main-nav-bar.component.css'],
    standalone: false
})
export class MainNavBarComponent implements OnInit {

  siteName = getAppConfig().site_name;

  navBarMenus = getAppConfig().navBar.nav_bar_menus;

  communityMailingList = getAppConfig().community_mailing_list;
  ensemblBlastURL = getAppConfig().ensembl_blast_url;
  cantoURL = getAppConfig().canto_url;
  cantoDocumentationURL = getAppConfig().canto_documentation_url;
  hasDiseaseAnnotation = getAppConfig().has_disease_annotation;
  hasAdminCuration = getAppConfig().has_admin_curation;

  constructor() { }

  entryIsRoute(menuEntry: NavBarEntry): boolean {
    return menuEntry.url.startsWith('/');
  }

  ngOnInit() {
  }

}
