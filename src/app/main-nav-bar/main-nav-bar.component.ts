import { Component, OnInit } from '@angular/core';

import { getAppConfig } from '../config';

@Component({
  selector: 'app-main-nav-bar',
  templateUrl: './main-nav-bar.component.html',
  styleUrls: ['./main-nav-bar.component.css']
})
export class MainNavBarComponent implements OnInit {

  siteName = getAppConfig().site_name;
  ensemblBlastURL = getAppConfig().ensembl_blast_url;

  constructor() { }

  ngOnInit() {
  }

}
