import { Component, OnInit, Input } from '@angular/core';
import { TextOrTermId } from '../util';

@Component({
    selector: 'app-description-display',
    templateUrl: './description-display.component.html',
    styleUrls: ['./description-display.component.css'],
    standalone: false
})
export class DescriptionDisplayComponent implements OnInit {
  @Input() description: string;

  // a decomposed version of the description as an Array of Objects
  // like: [{text: "abnormal cell ... ("}, {term: <a TermShort>}, {text: ")"}, ...]
  // which allows the the termids in a description to be linked to the term pages
  @Input() descriptionParts: Array<TextOrTermId> = [];

  constructor() { }

  ngOnInit() {
  }

}
