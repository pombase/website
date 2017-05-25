import { Component, OnInit, Input } from '@angular/core';

import { ReferenceShort } from '../pombase-api.service';

@Component({
  selector: 'app-reference-short-list',
  templateUrl: './reference-short-list.component.html',
  styleUrls: ['./reference-short-list.component.css']
})
export class ReferenceShortListComponent implements OnInit {
  @Input() references: Array<ReferenceShort> = [];

  constructor() { }

  ngOnInit() {
  }
}
