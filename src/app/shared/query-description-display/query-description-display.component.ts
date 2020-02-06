import { Component, OnInit, Input } from '@angular/core';
import { TermAndName } from '../../pombase-query';

@Component({
  selector: 'app-query-description-display',
  templateUrl: './query-description-display.component.html',
  styleUrls: ['./query-description-display.component.css']
})
export class QueryDescriptionDisplayComponent implements OnInit {
  @Input() description: string;

  // a decomposed version of the description as an Array of Objects
  // like: [{text: "abnormal cell ... ("}, {term: <a TermShort>}, {text: ")"}, ...]
  // which allows the the termids in a description to be linked to the term pages
  @Input() descriptionParts: Array<({ text?: string; term?: TermAndName; })> = [];

  constructor() { }

  ngOnInit() {
  }

}
