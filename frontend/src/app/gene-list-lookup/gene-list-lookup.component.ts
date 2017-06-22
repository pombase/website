import { Component, OnInit, OnChanges, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-gene-list-lookup',
  templateUrl: './gene-list-lookup.component.html',
  styleUrls: ['./gene-list-lookup.component.css']
})
export class GeneListLookupComponent implements OnInit {
  @Output() genesFound = new EventEmitter();

  inputText = '';

  constructor() { }

  ngOnInit() {
  }

  lookup() {
    let ids = this.inputText.trim().split(/\s+/);
    this.genesFound.emit(ids);
  }
}
