import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { GeneSummaryMap, PombaseAPIService } from '../pombase-api.service';

@Component({
  selector: 'app-gene-list-lookup',
  templateUrl: './gene-list-lookup.component.html',
  styleUrls: ['./gene-list-lookup.component.css']
})
export class GeneListLookupComponent implements OnInit {
  @Output() genesFound = new EventEmitter();

  inputText = '';
  inputFile = null;

  geneSummaryMap: GeneSummaryMap = null;
  unknownIds = [];

  constructor(private pombaseApiService: PombaseAPIService) {
    this.pombaseApiService.getGeneSummaryMapPromise().then((geneSummaryMap) => {
      this.geneSummaryMap = geneSummaryMap;
    });
  }

  ngOnInit() {
  }

  filteredIds(): Array<string> {
    let seen = {};
    return this.inputText.trim().split(/\s+/)
      .filter(id => {
        id = id.trim();
        if (id.length == 0) {
          return false;
        }
        if (id.match(/[^a-zA-Z0-9\-_:\.]/)) {
          return false;
        }
        if (seen[id]) {
          return false;
        }
        seen[id] = true;
        return true;
      })
  }

  checkIds() {
    if (!this.geneSummaryMap) {
      return;
    }

    let ids = this.filteredIds();
    this.unknownIds = [];

    for (let id of ids) {
      if (!this.geneSummaryMap[id.toLowerCase()]) {
        this.unknownIds.push(id);
      }
    }
  }

  readFile($event): void {
    let inputValue = $event.target;
    let file = inputValue.files[0];
    let fileReader = new FileReader();

    fileReader.onloadend = (e) => {
      this.inputText = fileReader.result;
    };

    fileReader.readAsText(file);

    this.checkIds();
  }

  lookup() {
    const genes = this.filteredIds()
      .filter(id => this.geneSummaryMap[id] || this.geneSummaryMap[id.toLowerCase()])
      .map(id => this.geneSummaryMap[id] || this.geneSummaryMap[id.toLowerCase()]);
    this.genesFound.emit(genes);
  }
}
