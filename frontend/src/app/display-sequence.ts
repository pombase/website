import { FeatureShort } from './pombase-api.service';

export class DisplaySequenceLinePart {
  constructor(readonly uniquename: string,
              readonly partType: string,
              readonly residues: string,
              readonly exonIndex: number | null) { }
}

export class DisplaySequenceLine {
  constructor(readonly lineParts: Array<DisplaySequenceLinePart>) { }

  add(linePart: DisplaySequenceLinePart): void {
    this.lineParts.push(linePart);
  }

  length(): number {
    let len = 0;

    this.lineParts.map(part => {
      len += part.residues.length;
    });

    return len;
  }

  getParts(): Array<DisplaySequenceLinePart> {
    return this.lineParts;
  }
}

export class DisplaySequence {
  private lines: Array<DisplaySequenceLine> = [new DisplaySequenceLine([])];

  constructor(private readonly lineLength: number,
              private readonly upstreamSequence: string,
              private readonly parts: Array<FeatureShort>,
              private readonly downstreamSequence: string) {
    const upstreamPart = {
      feature_type: 'upstream',
      residues: upstreamSequence,
      uniquename: 'upstream sequence',
    } as FeatureShort;
    const downstreamPart = {
      feature_type: 'downstream',
      residues: downstreamSequence,
      uniquename: 'downstream sequence',
    } as FeatureShort;

    let allAparts = [upstreamPart, ...parts, downstreamPart];

    let exonIndex = 1;
    allAparts.map(part => {
      if (part.feature_type === 'exon') {
        this.addToLines(part, exonIndex);
        exonIndex++;
      } else {
        this.addToLines(part, null);
      }
    });
  }

  private addToLines(part: FeatureShort, exonIndex: number | null): void {
    if (part.residues.length === 0) {
      return;
    }

    let currentLine = this.lines[this.lines.length - 1];

    let partCopy = {
      feature_type: part.feature_type,
      residues: part.residues,
      uniquename: part.uniquename,
    } as FeatureShort;

    while (true) {
      if (currentLine.length() + partCopy.residues.length <= this.lineLength) {
        const linePart = new DisplaySequenceLinePart(partCopy.uniquename,
                                                     partCopy.feature_type, partCopy.residues,
                                                     exonIndex);
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
                                                     exonIndex);
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
}
