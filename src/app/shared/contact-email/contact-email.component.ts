import { Component, OnInit, Input } from '@angular/core';

import { getAppConfig } from '../../config';

@Component({
  selector: 'app-contact-email',
  templateUrl: './contact-email.component.html',
  styleUrls: ['./contact-email.component.css']
})
export class ContactEmailComponent implements OnInit {
  @Input() linkName = 'Contact';
  @Input() subject: string;

  emailLink = 'mailto:' + getAppConfig().helpdesk_address;

  constructor() { }

  ngOnInit() {
    if (this.subject) {
      this.emailLink += '?subject=' + this.subject;
    }
  }
}
