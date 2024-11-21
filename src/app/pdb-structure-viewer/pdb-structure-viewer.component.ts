import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { AppConfig, getAppConfig } from '../config';
import { PDBEntry, PDBGeneChain, ReferenceShort } from '../pombase-api.service';

interface PDBContext {
  pdbId: string;
  title: string;
  authors: string;
}

interface DisplayEntry {
  pdb_id: string;
  title: string;
  reference: ReferenceShort;
  entry_authors_abbrev: string;
  experimental_method: string;
  gene_chains?: Array<PDBGeneChain>;
  resolution?: string;
  chain?: string;
  position?: string;
}

@Component({
    selector: 'app-pdb-structure-viewer',
    templateUrl: './pdb-structure-viewer.component.html',
    styleUrls: ['./pdb-structure-viewer.component.css'],
    standalone: false
})
export class PdbStructureViewerComponent implements OnInit {
  @Input() displayName?: string;
  @Input() pdbEntries: Array<PDBEntry>;
  @Input() pageType: 'gene' | 'reference';

  @ViewChild('pdbiframe') pdbiframe: ElementRef;

  appConfig: AppConfig = getAppConfig();

  sanitizedURL?: SafeResourceUrl;
  currentEntry?: DisplayEntry = undefined;

  status: 'loading' | 'loaded' = 'loading';
  displayEntries: Array<DisplayEntry>;

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

  selectEntry(displayEntry: DisplayEntry) {
    this.currentEntry = displayEntry;
    this.setURL();
  }

  popoverContext(displayEntry: DisplayEntry): PDBContext {
    let pdbId = displayEntry.pdb_id;
    let title = displayEntry.title;
    let authors = displayEntry.entry_authors_abbrev;

    return {
      pdbId,
      title,
      authors,
    };
  }

  displayResolution(displayEntry: DisplayEntry): string {
    if (displayEntry.resolution) {
      const parsedRes = Number.parseFloat(displayEntry.resolution);

      if (Number.isNaN(parsedRes)) {
        return '';
      } else {
        return '' + Math.round(parsedRes * 100) / 100.0;
      }
    } else {
      return '';
    }
  }

  popoverImageUrl(pdbId: string): string {
    return this.appConfig.pdbe_image_url.replace('<<PDB_ID>>', pdbId);
  }

  ngOnChanges(): void {
    this.makeDisplayEntries();
    this.currentEntry = this.displayEntries[0];
    this.setURL();
  }

  makeDisplayEntry(pdbEntry: PDBEntry, geneChain?: PDBGeneChain): DisplayEntry {
    let ret = {
      pdb_id: pdbEntry.pdb_id,
      title: pdbEntry.title,
      reference: pdbEntry.reference,
      entry_authors_abbrev: pdbEntry.entry_authors_abbrev,
      experimental_method: pdbEntry.experimental_method,
      resolution: pdbEntry.resolution,
      gene_chains: pdbEntry.gene_chains,
    } as DisplayEntry;

    if (geneChain) {
      ret.chain = geneChain.chain;
      ret.position = geneChain.position;
    }

    return ret;
  }

  makeDisplayEntries() {
    this.displayEntries = [];

    for (const entry of this.pdbEntries) {
      if (this.pageType == 'gene') {
        for (const geneChain of entry.gene_chains) {
          let displayEntry = this.makeDisplayEntry(entry, geneChain);
          this.displayEntries.push(displayEntry);
        }
      } else {
        let displayEntry = this.makeDisplayEntry(entry);
        this.displayEntries.push(displayEntry);
      }
    }
  }

  ngOnInit(): void {
  }
}
