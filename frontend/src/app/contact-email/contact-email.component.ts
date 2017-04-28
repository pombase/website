import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-contact-email',
  templateUrl: './contact-email.component.html',
  styleUrls: ['./contact-email.component.css']
})
export class ContactEmailComponent implements OnInit {
  @Input() linkName = 'Contact';
  @Input() subject = null;

  emailLink = 'mailto:helpdesk@pombase.org';

  constructor() { }

  ngOnInit() {
    if (this.subject) {
      this.emailLink += '?subject=' + this.subject;
    }
  }
}
