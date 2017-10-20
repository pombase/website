import { Component, OnInit, OnChanges, Input } from '@angular/core';

import { TranscriptDetails } from '../pombase-api.service';

@Component({
  selector: 'app-transcript-view',
  templateUrl: './transcript-view.component.html',
  styleUrls: ['./transcript-view.component.css']
})
export class TranscriptViewComponent implements OnInit, OnChanges {
  @Input() transcriptDetails: Array<TranscriptDetails>;

  transcripts = [];

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
    this.transcripts = [];
    for (let detail of this.transcriptDetails) {
      let ensemblImageUrl = `/browser_images/${detail.uniquename}_trans.png`;
      let ensemblBrowserUrl =
        `http://fungi.ensembl.org/Schizosaccharomyces_pombe/Transcript/Summary?t=${detail.uniquename}`;
      this.transcripts.push({
        ensemblImageUrl: ensemblImageUrl,
        ensemblBrowserUrl: ensemblBrowserUrl,
      });
    }
  }
}
