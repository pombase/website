import { Component, OnChanges, Input } from '@angular/core';

import { saveAs } from 'file-saver';

import { GeneDetails, PombaseAPIService, Strand } from '../pombase-api.service';
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
  sequenceDescription = '';
  sequenceHeader = '';
  hasTranscripts = false;

  showTranslation = false;
  includeExons = true;
  includeIntrons = false;
  include5PrimeUtr = false;
  include3PrimeUtr = false;
  upstreamBases = 0;
  downstreamBases = 0;

  constructor(private pombaseApiService: PombaseAPIService) { }

  updateSequence() {
    let transcripts = this.geneDetails.transcripts;
    this.hasTranscripts = transcripts.length > 0;

    if (this.hasTranscripts) {
      if (this.upstreamBases < 0) {
        this.upstreamBases = 0;
      }

      if (this.downstreamBases < 0) {
        this.downstreamBases = 0;
      }

      if (this.showTranslation) {
        this.sequence = Util.splitSequenceString(transcripts[0].protein.sequence);
      } else {
        this.sequence = null;

        let geneLocation = this.geneDetails.location;
        let strand;
        if (geneLocation.strand === 'forward') {
          strand = Strand.Forward;
        } else {
          strand = Strand.Reverse;
        }
        let chrName = geneLocation.chromosome;
        let geneStart = geneLocation.start_pos;
        let geneEnd = geneLocation.end_pos;
        let upstreamPromise;
        let downstreamPromise;

        if (this.upstreamBases > 0) {
          let [upstreamStart, upstreamEnd] =
            strand === Strand.Forward ?
             [geneStart - this.upstreamBases, geneStart - 1] :
             [geneEnd + 1, geneEnd + this.upstreamBases];
          upstreamPromise =
            this.pombaseApiService.getChrSubSequence(chrName, upstreamStart, upstreamEnd,
                                                     strand);
        } else {
          upstreamPromise = Promise.resolve('');
        }
        if (this.downstreamBases > 0) {
          let [downstreamStart, downstreamEnd] =
            strand === Strand.Forward ?
             [geneEnd + 1, geneEnd + this.downstreamBases] :
             [geneStart - this.downstreamBases, geneStart - 1];
          downstreamPromise =
            this.pombaseApiService.getChrSubSequence(chrName, downstreamStart, downstreamEnd,
                                                     strand);
        } else {
          downstreamPromise = Promise.resolve('');
        }

        Promise.all([upstreamPromise, downstreamPromise])
          .then((values) => {
            let sequence = values[0];
            for (let part of transcripts[0].parts) {
              if (part.feature_type === 'exon' && this.includeExons ||
                  part.feature_type === 'intron' && this.includeIntrons ||
                  part.feature_type === 'five_prime_utr' && this.include5PrimeUtr ||
                  part.feature_type === 'three_prime_utr' && this.include3PrimeUtr) {
                sequence += part.residues;
              }
            }
            sequence += values[1];

            this.sequence = Util.splitSequenceString(sequence);
          })
          .catch((e) => {
            this.sequence = '';
          });
      }
    }
  }

  download() {
    let fileName = this.sequenceDescription + '.fasta';
    saveAs(new Blob([this.sequenceHeader + '\n' + this.sequence],
                    { type: 'text' }), fileName);
  }

  showSequence() {
    this.sequenceVisible = true;
  }

  hideSequence() {
    this.sequenceVisible = false;
  }

  ngOnChanges() {
    this.sequenceDescription = this.geneDetails.uniquename;
    if (this.showTranslation) {
      this.sequenceDescription += '-peptide-sequence';
    } else {
      this.sequenceDescription += '-transcript-sequence';
    }
    this.sequenceHeader = this.sequenceDescription;

    this.updateSequence();
  }
}
