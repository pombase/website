import { Component, Input, OnInit } from '@angular/core';

import { getAppConfig } from '../../config';

@Component({
  selector: 'app-social-contact',
  templateUrl: './social-contact.component.html',
  styleUrls: ['./social-contact.component.css']
})
export class SocialContactComponent implements OnInit {
  @Input() subject = 'Comment or problem report for ' + getAppConfig().site_name;

  siteName = getAppConfig().site_name;
  showSocialMediaLinks = getAppConfig().social_media;

  constructor() {}

  ngOnInit() {
  }
}
