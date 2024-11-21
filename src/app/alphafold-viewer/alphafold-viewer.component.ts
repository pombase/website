import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { GeneDetails } from '../pombase-api.service';
import { AppConfig, getAppConfig } from '../config';

@Component({
    selector: 'app-alphafold-viewer',
    templateUrl: './alphafold-viewer.component.html',
    styleUrls: ['./alphafold-viewer.component.css'],
    standalone: false
})
export class AlphafoldViewerComponent implements OnInit {
  @Input() geneDetails: GeneDetails;

  @ViewChild('alphafoldiframe') alphafoldiframe: ElementRef;

  appConfig: AppConfig = getAppConfig();

  sanitizedAlphaFoldURL?: SafeResourceUrl;

  alphaFoldStatus: 'loading' | 'loaded' = 'loading';


  constructor(private sanitizer: DomSanitizer) { }

  proteinTooLong(): boolean {
    const protLength = this.geneDetails.transcripts[0].protein?.sequence.length;
    return !!protLength && protLength > this.appConfig.alphafoldMaxProteinLength;
  }

  alphaFoldFinishedLoading() {
    if (this.alphafoldiframe?.nativeElement.contentDocument?.body) {
      // This hack is needed because in Chrome the onload event is fired twice,
      // once when the iframe is added to the dom and then later when the
      // iframe is actually loaded
      //
      // See:
      // https://bugs.chromium.org/p/chromium/issues/detail?id=578812
      // https://itecnote.com/tecnote/javascript-dynamically-created-iframe-triggers-onload-event-twice/
      this.alphaFoldStatus = 'loaded';
    }
  }

  alphaFoldLoading() {
    return this.alphaFoldStatus == 'loading';
  }

  getAlphaFoldIFrameURL(): SafeResourceUrl | undefined {
    return this.sanitizedAlphaFoldURL;
  }

  ngOnChanges(): void {

    if (this.geneDetails.uniprot_identifier) {
      const rawUrl = 'structure_view/alphafold/' + this.geneDetails.uniprot_identifier;
      this.sanitizedAlphaFoldURL =
        this.sanitizer.bypassSecurityTrustResourceUrl(rawUrl);
    } else {
      this.sanitizedAlphaFoldURL = undefined;
    }
  }

  ngOnInit(): void {
  }

}
