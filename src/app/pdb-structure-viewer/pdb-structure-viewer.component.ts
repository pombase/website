import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { AppConfig, getAppConfig } from '../config';
import { GeneDetails, PDBEntry } from '../pombase-api.service';

@Component({
  selector: 'app-pdb-structure-viewer',
  templateUrl: './pdb-structure-viewer.component.html',
  styleUrls: ['./pdb-structure-viewer.component.css']
})
export class PdbStructureViewerComponent implements OnInit {
  @Input() geneDetails: GeneDetails;

  @ViewChild('pdbiframe') pdbiframe: ElementRef;

  appConfig: AppConfig = getAppConfig();

  sanitizedURL?: SafeResourceUrl;
  currentEntry?: PDBEntry = undefined;

  status: 'loading' | 'loaded' = 'loading';

  constructor(private sanitizer: DomSanitizer) { }

  finishedLoading() {
    if (this.pdbiframe?.nativeElement.contentDocument?.body) {
      // This hack is needed because in Chrome the onload event is fired twice,
      // once when the iframe is added to the dom and then later when the
      // iframe is actually loaded
      //
      // See:
      // https://bugs.chromium.org/p/chromium/issues/detail?id=578812
      // https://itecnote.com/tecnote/javascript-dynamically-created-iframe-triggers-onload-event-twice/
      this.status = 'loaded';
    }
  }

  structureLoading(): boolean {
    return this.status == 'loading';
  }

  setURL() {
    if (this.currentEntry) {
      const rawUrl = 'structure_view/pdb/' + this.currentEntry.pdb_id;
      this.sanitizedURL =
        this.sanitizer.bypassSecurityTrustResourceUrl(rawUrl);
    } else {
      this.sanitizedURL = undefined;
    }
  }

  selectEntry(pdbEntry: PDBEntry) {
    this.currentEntry = pdbEntry;
    this.setURL();
  }

  displayResolution(pdbEntry: PDBEntry): string {
    if (pdbEntry.resolution) {
      const parsedRes = Number.parseFloat(pdbEntry.resolution);

      if (Number.isNaN(parsedRes)) {
        return '';
      } else {
        return '' + Math.round(parsedRes * 100) / 100.0;
      }
    } else {
      return '';
    }
  }

  ngOnChanges(): void {
    this.currentEntry = this.geneDetails.pdb_entries[0];
    this.setURL();
  }

  ngOnInit(): void {
  }
}
