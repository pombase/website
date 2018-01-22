import { FeatureShort, ProteinDetails } from './pombase-api.service';

interface PartWithId extends FeatureShort {
  partId: number;
}

export class ResidueRange {
  constructor(readonly start: number, readonly end: number) { }
}

export class DisplaySequenceLinePart {
  constructor(readonly uniquename: string,
              readonly partType: string,
              readonly residues: string,
              readonly exonIndex: number | null,
              readonly partId: number) { }
}

export class DisplaySequenceLine {
  constructor(readonly lineParts: Array<DisplaySequenceLinePart>) { }

  add(linePart: DisplaySequenceLinePart): void {
    this.lineParts.push(linePart);
  }

  length(): number {
    return this.residues().length;
  }

  residues(): string {
    let res = '';

    this.lineParts.map(part => {
      res += part.residues;
    });

    return res;
  }

  getParts(): Array<DisplaySequenceLinePart> {
    return this.lineParts;
  }
}

let partIdCounter = 0;

class RawSequencePart {
  constructor(public partType: string,
              public residues: string,
              public uniquename: string) { }
}

export class DisplaySequence {
  private lines: Array<DisplaySequenceLine> = [new DisplaySequenceLine([])];

  static newFromProtein(lineLength: number, protein: ProteinDetails): DisplaySequence {
    const seqPart = new RawSequencePart('protein', protein.sequence, protein.uniquename);
    return new DisplaySequence(lineLength, [seqPart]);
  }

  static newFromTranscriptParts(lineLength: number,
                                upstreamSequence: string,
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
    return new DisplaySequence(lineLength, displayParts);
  }

  private constructor(private readonly lineLength: number,
                      private readonly displayParts: Array<RawSequencePart>) {
    let exonIndex = 1;
    displayParts.map(part => {
      if (part.partType === 'exon') {
        this.addToLines(part, exonIndex);
        exonIndex++;
      } else {
        this.addToLines(part, null);
      }
    });
  }

  private addToLines(part: RawSequencePart, exonIndex: number | null): void {
    if (part.residues.length === 0) {
      return;
    }

    let currentLine = this.lines[this.lines.length - 1];

    let partCopy = {
      feature_type: part.partType,
      residues: part.residues,
      uniquename: part.uniquename,
    } as PartWithId;

    while (true) {
      if (currentLine.length() + partCopy.residues.length <= this.lineLength) {
        const linePart = new DisplaySequenceLinePart(partCopy.uniquename,
                                                     partCopy.feature_type, partCopy.residues,
                                                     exonIndex, partIdCounter++);
        currentLine.add(linePart);

        if (currentLine.length() === this.lineLength) {
          this.lines.push(new DisplaySequenceLine([]));
        }

        return;
      } else {
        const sliceLength = this.lineLength - currentLine.length();
        const sliceResidues = partCopy.residues.slice(0, sliceLength);

        const linePart = new DisplaySequenceLinePart(partCopy.uniquename,
                                                     partCopy.feature_type, sliceResidues,
                                                     exonIndex, partIdCounter++);
        currentLine.add(linePart);

        const remainingResidues = partCopy.residues.slice(sliceLength);

        partCopy.residues = remainingResidues;

        if (currentLine.length() === this.lineLength) {
          currentLine = new DisplaySequenceLine([]);
          this.lines.push(currentLine);
        }
      }
    }
  }

  getLines(): Array<DisplaySequenceLine> {
    return this.lines;
  }

  residues(): string {
    let res = '';
    this.lines.map(line => res += line.residues());
    return res;
  }

  rangeFromParts(startPartId: number, startPartOffset: number,
                 endPartId: number, endPartOffset: number): ResidueRange
  {
    let residuesSoFar = 0;
    let startPos = -1;

    for (let lineIndex = 0; lineIndex < this.lines.length; ++lineIndex) {
      const parts = this.lines[lineIndex].getParts();
      for (let partIndex = 0; partIndex < parts.length; ++partIndex) {
        const part = parts[partIndex];
        if (part.partId === startPartId) {
          startPos = residuesSoFar + startPartOffset;
        }

        if (part.partId === endPartId) {
          if (startPos === -1) {
            return null;
          } else {
            const endPos = residuesSoFar + endPartOffset;
            return new ResidueRange(startPos + 1, endPos + 1);
          }
        }

        residuesSoFar += part.residues.length;
      }
    }

    return null;
  }
}
