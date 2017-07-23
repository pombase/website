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
  rawSequence = '';
  sequence = '';
  sequenceDescription = '';
  sequenceHeader = '';
  hasTranscripts = false;
  fivePrimeIntronCount = 0;
  threePrimeIntronCount = 0;

  geneStart = null;
  geneEnd = null;
  cdsStart = null;
  cdsEnd = null;

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
      if (this.showTranslation) {
        this.sequenceHeader += ' length:' +
          this.geneDetails.transcripts[0].protein.number_of_residues;
      } else {
        this.sequenceHeader += ' length:' + sequence.length;

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

    this.sequenceDescription = this.geneDetails.uniquename;

    if (this.hasTranscripts) {
      this.sequenceHeader = this.sequenceDescription;
      if (this.upstreamBases < 0) {
        this.upstreamBases = 0;
      }

      if (this.downstreamBases < 0) {
        this.downstreamBases = 0;
      }

      if (this.showTranslation) {
        this.sequenceDescription += '-peptide-sequence';
        this.updateHeader(this.sequence);
        this.rawSequence = transcripts[0].protein.sequence;
        this.sequence = Util.splitSequenceString(this.rawSequence);
      } else {
        this.sequenceDescription += '-transcript-sequence';
        this.rawSequence = '';
        this.sequence = null;

        let geneLocation = this.geneDetails.location;
        let strand;
        let coordStart;
        let coordEnd;
        if (geneLocation.strand === 'forward') {
          strand = Strand.Forward;
          if (this.include5PrimeUtr) {
            coordStart = this.geneStart;
          } else {
            coordStart = this.cdsStart;
          }
          if (this.include3PrimeUtr) {
            coordEnd = this.geneEnd;
          } else {
            coordEnd = this.cdsEnd;
          }
        } else {
          strand = Strand.Reverse;
          if (this.include5PrimeUtr) {
            coordEnd = this.geneEnd;
          } else {
            coordEnd = this.cdsEnd;
          }
          if (this.include3PrimeUtr) {
            coordStart = this.geneStart;
          } else {
            coordStart = this.cdsStart;
          }
        }
        let chrName = geneLocation.chromosome;

        let upstreamPromise;
        let downstreamPromise;

        if (this.upstreamBases > 0) {
          let [upstreamStart, upstreamEnd] =
            strand === Strand.Forward ?
             [coordStart - this.upstreamBases, coordStart - 1] :
             [coordEnd + 1, coordEnd + this.upstreamBases];
          upstreamPromise =
            this.apiService.getChrSubSequence(chrName, upstreamStart, upstreamEnd,
                                                     strand);
        } else {
          upstreamPromise = Promise.resolve('');
        }
        if (this.downstreamBases > 0) {
          let [downstreamStart, downstreamEnd] =
            strand === Strand.Forward ?
             [coordEnd + 1, coordEnd + this.downstreamBases] :
             [coordStart - this.downstreamBases, coordStart - 1];
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
                  this.includeIntrons && part.feature_type === 'cds_intron' ||
                  this.include5PrimeUtr &&
                  (part.feature_type === 'five_prime_utr' ||
                   this.includeIntrons && part.feature_type === 'five_prime_utr_intron') ||
                  this.include3PrimeUtr &&
                  (part.feature_type === 'three_prime_utr' ||
                   this.includeIntrons && part.feature_type === 'three_prime_utr_intron')) {
                sequence += part.residues;
              }
            }
            sequence += values[1];

            this.updateHeader(sequence);

            this.rawSequence = sequence;
            this.sequence = Util.splitSequenceString(this.rawSequence);
          })
          .catch((e) => {
            this.rawSequence = '';
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

    this.featureIsTranslatable =
      this.geneDetails.feature_type === 'mRNA gene' ||
      this.geneDetails.feature_type.startsWith('protein'); // future proofing
    this.showTranslation = false;
    this.includeIntrons = false;
    this.include5PrimeUtr = false;
    this.include3PrimeUtr = false;
    this.fivePrimeIntronCount = 0;
    this.threePrimeIntronCount = 0;
    this.geneStart = null;
    this.geneEnd = null;
    this.cdsStart = null;
    this.cdsEnd = null;

    let transcripts = this.geneDetails.transcripts;

    if (transcripts) {
      for (let part of transcripts[0].parts) {
        if (part.feature_type === 'five_prime_utr_intron') {
          this.fivePrimeIntronCount++;
        }
        if (part.feature_type === 'three_prime_utr_intron') {
          this.threePrimeIntronCount++;
        }

        if (part.feature_type === 'exon') {
          if (!this.cdsStart || this.cdsStart > part.location.start_pos) {
            this.cdsStart = part.location.start_pos;
          }
          if (!this.cdsEnd || this.cdsEnd < part.location.end_pos) {
            this.cdsEnd = part.location.end_pos;
          }
        }
        if (!this.geneStart || this.geneStart > part.location.start_pos) {
          this.geneStart = part.location.start_pos;
        }
        if (!this.geneEnd || this.geneEnd < part.location.end_pos) {
          this.geneEnd = part.location.end_pos;
        }
      }
    }

    this.prefetch();

    this.updateSequence();
  }
}
