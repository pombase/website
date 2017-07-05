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

  sequenceVisible = true;
  sequence = '';
  sequenceDescription = '';
  sequenceHeader = '';
  hasTranscripts = false;

  featureIsTranslatable = false;
  showTranslation = false;
  includeIntrons = false;
  include5PrimeUtr = false;
  include3PrimeUtr = false;
  upstreamBases = 0;
  downstreamBases = 0;

  constructor(private apiService: PombaseAPIService) { }

  updateHeader(sequence: string) {
    this.sequenceHeader = this.sequenceDescription;

    if (sequence) {
      this.sequenceHeader += ' length:' + sequence.length;

      if (!this.showTranslation) {
        let partsFlags = [];
        if (this.include5PrimeUtr) {
          partsFlags.push('5\'UTR');
        }
        partsFlags.push('exons');
        if (this.includeIntrons) {
          partsFlags.push('introns');
        }
        if (this.include3PrimeUtr) {
          partsFlags.push('3\'UTR');
        }
        if (partsFlags.length > 0) {
          this.sequenceHeader += ' includes:' + partsFlags.join('+');
        }
        this.sequenceHeader +=
          (this.upstreamBases > 0 ? ' upstream:' + this.upstreamBases : '') +
          (this.downstreamBases > 0 ? ' downstream:' + this.downstreamBases : '');
      }
    }
  }

  updateSequence() {
    let transcripts = this.geneDetails.transcripts;
    this.hasTranscripts = transcripts.length > 0;

    if (this.hasTranscripts) {
      this.sequenceHeader = this.sequenceDescription;
      if (this.upstreamBases < 0) {
        this.upstreamBases = 0;
      }

      if (this.downstreamBases < 0) {
        this.downstreamBases = 0;
      }

      if (this.showTranslation) {
        this.updateHeader(this.sequence);
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
            this.apiService.getChrSubSequence(chrName, upstreamStart, upstreamEnd,
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
            this.apiService.getChrSubSequence(chrName, downstreamStart, downstreamEnd,
                                                     strand);
        } else {
          downstreamPromise = Promise.resolve('');
        }

        Promise.all([upstreamPromise, downstreamPromise])
          .then((values) => {
            let sequence = values[0];
            for (let part of transcripts[0].parts) {
              if (part.feature_type === 'exon' ||
                  part.feature_type === 'intron' && this.includeIntrons ||
                  part.feature_type === 'five_prime_utr' && this.include5PrimeUtr ||
                  part.feature_type === 'three_prime_utr' && this.include3PrimeUtr) {
                sequence += part.residues;
              }
            }
            sequence += values[1];

            this.updateHeader(sequence);

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
    saveAs(new Blob(['>' + this.sequenceHeader + '\n' + this.sequence],
                    { type: 'text' }), fileName);
  }

  showSequence() {
    this.sequenceVisible = true;
  }

  hideSequence() {
    this.sequenceVisible = false;
  }

  prefetch() {
    let geneLocation = this.geneDetails.location;
    let strand;
    if (geneLocation.strand === 'forward') {
      strand = Strand.Forward;
    } else {
      strand = Strand.Reverse;
    }

    this.apiService.getChrSubSequence(geneLocation.chromosome,
                                      geneLocation.start_pos - 2000,
                                      geneLocation.end_pos + 2000, strand);
  }

  ngOnChanges() {
    this.upstreamBases = 0;
    this.downstreamBases = 0;

    this.featureIsTranslatable = this.geneDetails.feature_type === 'mRNA gene';
    this.showTranslation = false;
    this.includeIntrons = false;
    this.include5PrimeUtr = false;
    this.include3PrimeUtr = false;

    this.prefetch();

    this.sequenceDescription = this.geneDetails.uniquename;
    if (this.showTranslation) {
      this.sequenceDescription += '-peptide-sequence';
    } else {
      this.sequenceDescription += '-transcript-sequence';
    }

    this.updateSequence();
  }
}
