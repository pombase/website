import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-help-link',
    templateUrl: './help-link.component.html',
    styleUrls: ['./help-link.component.css'],
    standalone: false
})
export class HelpLinkComponent implements OnInit {
  @Input() route: string;
  @Input() title = 'Visit documentation';

  constructor() { }

  ngOnInit() {
  }

}
