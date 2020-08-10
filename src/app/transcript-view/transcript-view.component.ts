import { Component, OnInit, OnChanges, Input } from '@angular/core';

import { TranscriptDetails, GeneDetails, FeatureShort } from '../pombase-api.service';
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
      const displayPart = new DisplayPart(part, exonCount, intronCount);
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
  private _nextIntron: DisplayPart

  constructor(private part: FeatureShort, private exonCount: number,
              private intronCount: number) {
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
        return 'exon ' + this.exonCount;
      } else {
        return this.displayType();
      }
    }
  }

  setNextIntron(nextIntron: DisplayPart) {
    this._nextIntron = nextIntron;
  }

  public nextIntron(): DisplayPart {
    return this._nextIntron;
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

  public startPos(): number {
    return this.part.location.start_pos;
  }

  public endPos(): number {
    return this.part.location.end_pos;
  }

  public displayLocation(): string {
   if (this.part.location.strand === 'reverse') {
      return this.endPos() + '-' + this.startPos();
    } else {
      return this.startPos() + '-' + this.endPos();
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
