import { FeatureShort, ProteinDetails } from './pombase-api.service';

export class ResidueRange {
  constructor(readonly start: number, readonly end: number) { }
}

export class DisplaySequencePart {
  constructor(readonly uniquename: string,
              readonly partType: string,
              readonly residues: string,
              readonly exonIndex: number | null,
              readonly partId: number) { }
}

let partIdCounter = 0;

class RawSequencePart {
  constructor(public partType: string,
              public residues: string,
              public uniquename: string) { }
}

export class DisplaySequence {
  private parts: Array<DisplaySequencePart> = [];

  static newFromProtein(protein: ProteinDetails): DisplaySequence {
    const seqPart = new RawSequencePart('protein', protein.sequence, protein.uniquename);
    return new DisplaySequence([seqPart]);
  }

  static newFromTranscriptParts(upstreamSequence: string,
                                parts: Array<FeatureShort>,
                                downstreamSequence: string) {
    const upstreamPart = new RawSequencePart('upstream', upstreamSequence,
                                             'upstream sequence');
    const downstreamPart = new RawSequencePart('downstream', downstreamSequence,
                                               'downstream sequence');
    const seqParts = parts.map(part => {
      return new RawSequencePart(part.feature_type, part.residues, part.uniquename);
    });
    const displayParts = [upstreamPart, ...seqParts, downstreamPart];
    return new DisplaySequence(displayParts);
  }

  private constructor(public readonly displayParts: Array<RawSequencePart>) {
    let exonIndex = 1;
    displayParts.map(part => {
      if (part.partType === 'exon') {
        this.addPart(part, exonIndex);
        exonIndex++;
      } else {
        this.addPart(part, null);
      }
    });
  }

  private addPart(rawPart: RawSequencePart, exonIndex: number | null) {
    if (rawPart.residues.length === 0) {
      return;
    }

    const part = new DisplaySequencePart(rawPart.uniquename,
                                         rawPart.partType, rawPart.residues,
                                         exonIndex, partIdCounter++);
    this.parts.push(part);
  }

  getParts(): Array<DisplaySequencePart> {
    return this.parts;
  }

  residues(): string {
    let res = '';
    this.parts.map(part => res += part.residues);
    return res;
  }

  rangeFromParts(startPartId: number, startPartOffset: number,
                 endPartId: number, endPartOffset: number): ResidueRange|undefined {
    let residuesSoFar = 0;
    let startPos = -1;

    for (let lineIndex = 0; lineIndex < this.parts.length; ++lineIndex) {

      const part = this.parts[lineIndex];
        if (part.partId === startPartId) {
          startPos = residuesSoFar + startPartOffset;
        }

        if (part.partId === endPartId) {
          if (startPos === -1) {
            return undefined;
          } else {
            const endPos = residuesSoFar + endPartOffset;
            return new ResidueRange(startPos + 1, endPos + 1);
          }
        }

        residuesSoFar += part.residues.length;
      }


    return undefined;
  }
}
