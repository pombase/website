import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-gene-list-lookup',
  templateUrl: './gene-list-lookup.component.html',
  styleUrls: ['./gene-list-lookup.component.css']
})
export class GeneListLookupComponent implements OnInit {
  @Output() genesFound = new EventEmitter();

  inputText = '';
  inputFile = null;

  constructor() { }

  ngOnInit() {
  }

  readFile($event): void {
    let inputValue = $event.target;
    let file = inputValue.files[0];
    let fileReader = new FileReader();

    fileReader.onloadend = (e) => {
      this.inputText = fileReader.result;
    };

    fileReader.readAsText(file);
  }

  lookup() {
    let ids = this.inputText.trim().split(/\s+/);
    this.genesFound.emit(ids);
  }
}
