import { Component, OnInit, OnChanges, Input } from '@angular/core';

import { TranscriptDetails, GeneDetails, FeatureShort, ChromosomeLocation } from '../pombase-api.service';
import { AppConfig, getAppConfig } from '../config';

class DisplayTranscript {
  private _displayParts: Array<DisplayPart> = [];
  private _nonIntronParts: Array<DisplayPart> = [];
  private _hightlightedPartId: string = null;
  private _locationString: string = null;

  constructor(private transcript: TranscriptDetails) {
    let totalLength = 0;

    let exonCount = 0;
    let intronCount = 0;

    for (const part of transcript.parts) {
      if (part.feature_type == 'exon') {
        exonCount++;
      } else {
        if (part.feature_type == 'cds_intron') {
          intronCount++;
        }
      }
      const displayPart = new DisplayPart(part, transcript.location,
                                          exonCount, intronCount);
      this._displayParts.push(displayPart);
      totalLength += displayPart.baseLength();
    }

    for (let i = 0; i < this._displayParts.length; i++) {
      const displayPart = this._displayParts[i];
      if (i+1 < this._displayParts.length) {
        const nextPart = this._displayParts[i+1];
        displayPart.setNext(nextPart);
      }
      if (i > 0) {
        const previousPart = this._displayParts[i-1];
        displayPart.setPrevious(previousPart);
      }
      displayPart.setDivVW(totalLength);
    }

    this._nonIntronParts =
      this._displayParts.filter(part => !part.type().endsWith('intron'));

    const len = transcript.location.end_pos - transcript.location.start_pos + 1;

    if (transcript.location.strand === 'reverse') {
      this._locationString = `${transcript.location.end_pos}-${transcript.location.start_pos}`;
    } else {
      this._locationString = `${transcript.location.start_pos}-${transcript.location.end_pos}`;
    }

    this._locationString += ` (${len}nt)`;
  }

  public startPos(): number {
    return this.transcript.location.start_pos;
  }

  public endPos(): number {
    return this.transcript.location.end_pos;
  }

  public setHighlightedPart(partId: string) {
    this._hightlightedPartId = partId;
  }

  public getHighlightedPart(): string {
    return this._hightlightedPartId;
  }

  public displayParts(): Array<DisplayPart> {
    return this._displayParts;
  }

  public displayLocation(): string {
    return this._locationString;
  }

  public nonIntronParts(): Array<DisplayPart> {
    return this._nonIntronParts;
  }

  public type(): string {
    return this.transcript.transcript_type;
  }

  public uniquename(): string {
    return this.transcript.uniquename;
  }
}

class DisplayPart {
  private _divWidth: number = -1;
  private _id: string = null;
  private _next: DisplayPart;
  private _previous: DisplayPart;

  constructor(private part: FeatureShort,
              private transcriptLocation: ChromosomeLocation,
              private exonCount: number, private intronCount: number) {
    this._id = part.uniquename.replace(/:/g, '-');
  }

  public displayType(): string {
    if (this.type() == 'five_prime_utr') {
      return "5'UTR";
    }
    if (this.type() == 'three_prime_utr') {
      return "3'UTR";
    }
    if (this.type() == 'cds_intron') {
      return "intron";
    }
    if (this.type() == 'five_prime_utr_intron') {
      return "5'UTR intron";
    }
    if (this.type() == 'three_prime_utr_intron') {
      return "3'UTR intron";
    }
    return this.type();
  }

  public displayName(): string {
    if (this.type() === 'cds_intron') {
      return 'intron ' + this.intronCount;
    } else {
      if (this.type() === 'exon') {
        return 'exon CDS ' + this.exonCount;
      } else {
        return this.displayType();
      }
    }
  }

  setNext(nextPart: DisplayPart) {
    this._next = nextPart;
  }

  setPrevious(previousPart: DisplayPart) {
    this._previous = previousPart;
  }

  public nextPart(): DisplayPart {
    return this._next;
  }

  public previousPart(): DisplayPart {
    return this._previous;
  }

  public uniquename(): string {
    return this.part.uniquename;
  }

  public partId(): string {
    return this._id;
  }

  public type(): string {
    return this.part.feature_type;
  }

  public startPos(showTranscriptCoords: boolean): number {
    if (showTranscriptCoords) {
      if (this.part.location.strand === 'reverse') {
        return this.transcriptLocation.end_pos - this.part.location.start_pos + 1;
      }

      return this.part.location.start_pos - this.transcriptLocation.start_pos + 1;
    }

    return this.part.location.start_pos;
  }

  public endPos(showTranscriptCoords: boolean): number {
    if (showTranscriptCoords) {
      if (this.part.location.strand === 'reverse') {
        return this.transcriptLocation.end_pos - this.part.location.end_pos + 1;
      }

      return this.part.location.end_pos - this.transcriptLocation.start_pos + 1;
    }
    return this.part.location.end_pos;
  }

  public displayLocation(showTranscriptCoords: boolean): string {
    if (this.part.location.strand === 'reverse') {
      return this.endPos(showTranscriptCoords) + '-' +
        this.startPos(showTranscriptCoords);
    } else {
      return this.startPos(showTranscriptCoords) + '-' +
        this.endPos(showTranscriptCoords);
    }
  }

  public baseLength(): number {
    return this.part.location.end_pos - this.part.location.start_pos + 1;
  }

  setDivVW(totalLength: number) {
    this._divWidth = Math.round(Math.max(1, 100 * this.baseLength() / totalLength)) / 1.5;
  }

  getDivVW(): number {
    return this._divWidth;
  }
}

@Component({
  selector: 'app-transcript-view',
  templateUrl: './transcript-view.component.html',
  styleUrls: ['./transcript-view.component.css']
})
export class TranscriptViewComponent implements OnInit, OnChanges {
  @Input() geneDetails: GeneDetails;

  transcripts: Array<TranscriptDetails> = null;

  chromosomeDisplayName: string = null;
  displayTranscripts: Array<DisplayTranscript> = [];

  appConfig: AppConfig = getAppConfig();

  showTranscriptCoords = false;

  constructor() { }

  updateDisplayStrings() {
    const location = this.geneDetails.location;
    const chromosomeName = location.chromosome_name;
    const chromosomeConfig = this.appConfig.chromosomes[chromosomeName];
    this.displayTranscripts = [];

    this.chromosomeDisplayName = chromosomeConfig.short_display_name || chromosomeName;

    for (const transcript of this.transcripts) {
      this.displayTranscripts.push(new DisplayTranscript(transcript));
    }
  }


  public geneStrand(): string {
    return this.geneDetails.location.strand;
  }

  public popoverContent(part: DisplayPart): string {
    let prefix = null;

    if (part.type() === 'exon') {
      if ((!part.previousPart() || part.previousPart().type() === 'cds_intron') &&
          (!part.nextPart() || part.nextPart().type() === 'cds_intron')) {
        prefix = 'Coding exon'
      } else {
        if (part.previousPart() && part.previousPart().type().startsWith('five_prime_utr') ||
            part.nextPart() && part.nextPart().type().startsWith('three_prime_utr')) {
          prefix = 'Coding part of exon';
        } else {
          prefix = 'Exon';
        }
      }
    } else {
      prefix = part.displayType();
    }

    return prefix + ' - genomic location: ' + part.displayLocation(false) +
      ', transcript location: ' + part.displayLocation(true);
  }

  public partTrackBy(_index: number, item: DisplayPart): string {
    return item.partId();
  }

  ngOnInit() {
  }

  ngOnChanges() {
    if (!this.geneDetails) {
      this.transcripts = null;
      this.chromosomeDisplayName = null;
      this.displayTranscripts = [];
      return;
    }
    this.transcripts = this.geneDetails.transcripts;
    this.updateDisplayStrings();
  }
}
