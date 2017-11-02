import { Component, OnChanges, Input } from '@angular/core';

import { saveAs } from 'file-saver';

import { GeneDetails, PombaseAPIService, Strand } from '../pombase-api.service';
import { Util } from '../shared/util';
import { DisplaySequence, DisplaySequenceLinePart } from '../display-sequence';

const lineLength = 60;

@Component({
  selector: 'app-transcript-sequence-select',
  templateUrl: './transcript-sequence-select.component.html',
  styleUrls: ['./transcript-sequence-select.component.css']
})
export class TranscriptSequenceSelectComponent implements OnChanges {
  @Input() geneDetails: GeneDetails;

  rawSequence = '';
  wrappedSequence = '';
  displaySequence: DisplaySequence = null;
  sequenceDescription = '';
  sequenceHeader = '';
  hasTranscripts = false;
  fivePrimeIntronCount = 0;
  threePrimeIntronCount = 0;
  cdsIntronCount = 0;
  has5PrimeUtr = false;
  has3PrimeUtr = false;

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

  linksInNewWindow = false;

  hoverPart: DisplaySequenceLinePart = null;

  constructor(private apiService: PombaseAPIService) { }

  updateHeader(sequenceLength: number) {
    this.sequenceHeader = this.sequenceDescription;

    if (this.showTranslation) {
      this.sequenceHeader += ' length:' +
        this.geneDetails.transcripts[0].protein.number_of_residues;
    } else {
      this.sequenceHeader += ' length:' + sequenceLength;

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

  partTitle(part: DisplaySequenceLinePart): string {
    if (part.partType === 'exon') {
      return part.partType + ' ' + part.exonIndex;
    } else {
      return part.partType;
    }
  }

  partClass(part: DisplaySequenceLinePart): string {
    let retVal = 'part-' + part.partType;

    if (this.hoverPart !== null && this.hoverPart.partType === part.partType) {
      if (this.hoverPart.partType !== 'exon' ||
          this.hoverPart.exonIndex === part.exonIndex) {
        retVal += ' hovering';
      }
    }

    return retVal;
  }

  mouseenter(part: DisplaySequenceLinePart): void {
    this.hoverPart = part;
  }

  mouseleave(): void {
    this.hoverPart = null;
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

      this.wrappedSequence = null;
      this.displaySequence = null;

      if (this.showTranslation) {
        this.sequenceDescription += '-peptide-sequence';
        this.rawSequence = transcripts[0].protein.sequence;
        this.updateHeader(this.rawSequence.length);
        this.wrappedSequence = Util.splitSequenceString(this.rawSequence);
      } else {
        this.sequenceDescription += '-transcript-sequence';
        this.rawSequence = '';

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

        let upstreamPromise: Promise<string>;
        let downstreamPromise: Promise<string>;

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
            const upstreamSequence = values[0];
            let includedParts = [];
            for (let part of transcripts[0].parts) {
              if (part.feature_type === 'exon' ||
                  this.includeIntrons && part.feature_type === 'cds_intron' ||
                  this.include5PrimeUtr &&
                  (part.feature_type === 'five_prime_utr' ||
                   this.includeIntrons && part.feature_type === 'five_prime_utr_intron') ||
                  this.include3PrimeUtr &&
                  (part.feature_type === 'three_prime_utr' ||
                   this.includeIntrons && part.feature_type === 'three_prime_utr_intron')) {
                includedParts.push(part);
              }
            }
            const downstreamSequence = values[1];

            this.displaySequence =
              new DisplaySequence(lineLength,
                                  upstreamSequence, includedParts, downstreamSequence);

            this.rawSequence = this.displaySequence.residues();
            this.updateHeader(this.rawSequence.length);

            this.wrappedSequence = Util.splitSequenceString(this.rawSequence);

          })
          .catch((e) => {
            this.rawSequence = '';
            this.wrappedSequence = '';
            this.displaySequence = null;
          });
      }
    }
  }

  download() {
    let fileName = this.sequenceDescription + '.fasta';
    saveAs(new Blob(['>' + this.sequenceHeader + '\n' + this.wrappedSequence],
                    { type: 'text' }), fileName);
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
    this.cdsIntronCount = 0;
    this.has5PrimeUtr = false;
    this.has3PrimeUtr = false;

    this.geneStart = null;
    this.geneEnd = null;
    this.cdsStart = null;
    this.cdsEnd = null;

    let transcripts = this.geneDetails.transcripts;

    if (transcripts && transcripts.length > 0) {
      for (let part of transcripts[0].parts) {
        if (part.feature_type === 'five_prime_utr_intron') {
          this.fivePrimeIntronCount++;
        }
        if (part.feature_type === 'three_prime_utr_intron') {
          this.threePrimeIntronCount++;
        }
        if (part.feature_type === 'cds_intron') {
          this.cdsIntronCount++;
        }
        if (part.feature_type === 'five_prime_utr') {
          this.has5PrimeUtr = true;
        }
        if (part.feature_type === 'three_prime_utr') {
          this.has3PrimeUtr = true;
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
