import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { getAppConfig } from '../config';

import { GeneSummaryMap, PombaseAPIService, GeneSummary } from '../pombase-api.service';

@Component({
  selector: 'app-gene-list-lookup',
  templateUrl: './gene-list-lookup.component.html',
  styleUrls: ['./gene-list-lookup.component.css']
})
export class GeneListLookupComponent implements OnInit {
  @Input() lookupFieldType: 'id-and-name'|'uniprot-id';
  @Output() genesFound = new EventEmitter();

  inputText = '';
  listName?: string;

  appConfig = getAppConfig();

  unknownIds: Array<string> = [];
  geneSummaryMapPromise: Promise<GeneSummaryMap>;

  constructor(private pombaseApiService: PombaseAPIService) {
  }

  ngOnInit() {
    if (this.lookupFieldType === 'uniprot-id') {
      this.geneSummaryMapPromise = this.pombaseApiService.getGeneSummaryUniprotMapPromise();
    } else {
      this.geneSummaryMapPromise = this.pombaseApiService.getGeneSummaryMapPromise();
    }
  }

  filteredIds(): Array<string> {
    let seen: { [key: string]: boolean } = {};
    return this.inputText.trim().split(/[,\s\u200B]+/)
      .filter(id => {
        id = id.trim();
        if (id.length === 0) {
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
    this.geneSummaryMapPromise.then((geneSummaryMap) => {
      let ids = this.filteredIds();
      this.unknownIds = [];

      for (let id of ids) {
        if (!geneSummaryMap[id.toLowerCase()]) {
          this.unknownIds.push(id);
        }
      }
    });
  }

  readFile($event: Event): void {
    let inputValue = $event.target as any;
    let file = inputValue.files[0];
    let fileReader = new FileReader();

    fileReader.onloadend = () => {
      this.inputText = fileReader.result as string;
    };

    fileReader.readAsText(file);

    this.checkIds();
  }

  private makeListName(genes: Array<GeneSummary>): string {
    if (this.listName) {
      return this.listName;
    }

    if (genes.length <= 8) {
      return 'uploaded gene list: ' +
        genes.map(g => g.displayName()).join(' ');
    } else {
      return 'uploaded gene list of ' + genes.length + ' genes';
    }
  }

  lookup() {
    this.geneSummaryMapPromise.then((geneSummaryMap) => {
      const mapFilterFunc =
        (id: string) => {
          return geneSummaryMap[id] || geneSummaryMap[id.toLowerCase()];
        };

      const genes = this.filteredIds()
        .filter(mapFilterFunc)
        .map(mapFilterFunc);
      const listName = this.makeListName(genes);
      this.genesFound.emit({ genes, listName });
    });
  }
}
