import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-with-or-from-link',
  templateUrl: './with-or-from-link.component.html',
  styleUrls: ['./with-or-from-link.component.css']
})
export class WithOrFromLinkComponent implements OnInit {
  @Input() withOrFrom: any;

  constructor() { }

  ngOnInit() {
  }
}
