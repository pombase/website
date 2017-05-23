import { Component, OnChanges, Input } from '@angular/core';

import { saveAs } from 'file-saver';

import { GeneDetails } from '../pombase-api.service';
import { Util } from '../util';

@Component({
  selector: 'app-transcript-sequence-select',
  templateUrl: './transcript-sequence-select.component.html',
  styleUrls: ['./transcript-sequence-select.component.css']
})
export class TranscriptSequenceSelectComponent implements OnChanges {
  @Input() geneDetails: GeneDetails;

  sequenceVisible = false;
  sequence = '';
  hasTranscripts = false;

  includeExons = true;
  includeIntrons = false;
  include5PrimeUtr = false;
  include3PrimeUtr = false;

  constructor() { }

  updateSequence() {
    let transcripts = this.geneDetails.transcripts;
    this.hasTranscripts = transcripts.length > 0;

    if (this.hasTranscripts) {
      let sequence = '';

      for (let part of transcripts[0].parts) {
        if (part.feature_type === 'exon' && this.includeExons ||
            part.feature_type === 'intron' && this.includeIntrons ||
            part.feature_type === 'five_prime_utr' && this.include5PrimeUtr ||
            part.feature_type === 'three_prime_utr' && this.include3PrimeUtr) {
          sequence += part.residues;
        }
      }

      this.sequence = Util.splitSequenceString(sequence);
    } else {
      this.sequence = '';
    }
  }

  download() {
    saveAs(new Blob([this.sequence], { type: 'text' }),
           this.geneDetails.uniquename + '-transcript-sequence.fasta');
  }

  showSequence() {
    this.sequenceVisible = true;
  }

  hideSequence() {
    this.sequenceVisible = false;
  }

  ngOnChanges() {
    this.updateSequence();
  }
}
