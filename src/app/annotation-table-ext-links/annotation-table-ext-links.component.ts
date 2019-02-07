import { Component, OnInit, Input, OnChanges } from '@angular/core';

import { AnnotationExternalLinkConfig } from '../config';

@Component({
  selector: 'app-annotation-table-ext-links',
  templateUrl: './annotation-table-ext-links.component.html',
  styleUrls: ['./annotation-table-ext-links.component.css']
})
export class AnnotationTableExtLinksComponent implements OnInit, OnChanges {
  @Input() termIds: Array<string> = [];
  @Input() extLinksConfig: Array<AnnotationExternalLinkConfig> = [];

  termIdString = '';

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
    this.termIdString = this.termIds.join('%2C');
  }
}
