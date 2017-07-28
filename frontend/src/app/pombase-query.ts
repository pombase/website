export interface ResultRow {
  gene_uniquename: string;
}

export class QueryResult {
  constructor(
    public status: string,
    public rows: ResultRow[]) { }
}

export class TermShort {
  constructor(public termid: TermId,
              public name: string,
              public definition: string,
              public interesting_parents: Array<string>,
              public is_obsolete: boolean) { }
}

export enum QueryNodeOperator {
  And,
  Or,
  Not,
}

export type GeneUniquename = string;
export type TermId = string;

export abstract class GeneQueryNode {
  public abstract toObject(): Object;
}

export class GeneBoolNode extends GeneQueryNode {
  private operator: QueryNodeOperator;

  constructor(operator: string,
              public parts: GeneQueryNode[]) {
    super();
    if (operator.toLowerCase() === 'and') {
      this.operator = QueryNodeOperator.And;
    } else {
      if (operator.toLowerCase() === 'or') {
        this.operator = QueryNodeOperator.Or;
      } else {
        if (operator.toLowerCase() === 'not') {
          if (parts.length !== 2) {
            console.log("A NOT query must have 2 parts");
          }
          this.operator = QueryNodeOperator.Not;
        } else {
          throw new Error('unknown operator: ' + operator);
        }
      }
    }
  }

  getOperator(): QueryNodeOperator {
    return this.operator;
  }

  getParts(): GeneQueryNode[] {
    return this.parts;
  }

  toObject(): Object {
    let ret = {};
    ret[QueryNodeOperator[this.operator].toLowerCase()] =
      this.getParts().map((part: GeneQueryNode) => part.toObject());
    return ret;
  }

  opString(): string {
    if (this.operator === QueryNodeOperator.And) {
      return 'INTERSECT';
    } else {
      if (this.operator === QueryNodeOperator.Or) {
        return 'UNION';
      } else {
        return 'BUT_NOT';
      }
    }
  }

  toString(): string {
    return '(' + this.getParts().join(' ' + this.opString() + ' ') + ')';
  }
}

export class GeneListNode extends GeneQueryNode {
  constructor(public genes: Array<GeneUniquename>) {
    super();
  };

  toObject(): Object {
    return {
      'gene_list': this.genes,
    };
  }

  toString(): string {
    let s = this.genes.slice(0, 10).join(' ');
    if (this.genes.length > 10) {
      s += ' ...';
    }
    return `[${s}]`;
  }
}

export enum TermAlleleSingleOrMulti {
  Single = 'single',
  Multi = 'multi',
  Both = 'both',
}

export class TermNode extends GeneQueryNode {
  constructor(private term: TermShort,
              private singleOrMultiAllele: TermAlleleSingleOrMulti) {
    super();
  };

  getTerm(): TermShort {
    return this.term;
  }

  getSingleOrMulti(): TermAlleleSingleOrMulti {
    return this.singleOrMultiAllele;
  }

  toObject(): Object {
    let singleOrMultiAllele =
      this.singleOrMultiAllele ?
      this.singleOrMultiAllele.toString().toLowerCase() :
      null;

    return { termid: [this.term.termid, singleOrMultiAllele] }
  }

  toString(): string {
    return `${this.term.name} ${this.term.termid}`;
  }
}

export class SubsetNode extends GeneQueryNode {
  constructor(public subsetName: string,
              public subsetDisplayName: string) {
    super();
  };

  toObject(): Object {
    return {
      'subset': this.subsetName,
    };
  }

  toString(): string {
    if (this.subsetDisplayName) {
      return this.subsetDisplayName;
    } else {
      return this.subsetName;
    }
  }
}

function rangeToString(rangeNode: RangeNode) {
  if (!rangeNode.rangeEnd) {
    return rangeNode.rangeType + '(>' + rangeNode.rangeStart + ')';
  } else {
    if (!rangeNode.rangeStart) {
      return rangeNode.rangeType + '(<' + rangeNode.rangeEnd + ')';
    } else {
      return rangeNode.rangeType + '(' + rangeNode.rangeStart + '..' + rangeNode.rangeEnd + ')';
    }
  }
}

export abstract class RangeNode extends GeneQueryNode {
  constructor(public rangeType: string,
              public rangeStart: number, public rangeEnd: number) {
    super();
  };
}

export class IntRangeNode extends RangeNode {
  toObject(): Object {
    return {
      int_range: [this.rangeType,
        Math.floor(this.rangeStart),
        Math.floor(this.rangeEnd),
      ]
    };
  }

  toString(): string {
    return rangeToString(this);
  }
}

export class FloatRangeNode extends RangeNode {
  toObject(): Object {
    return {
      float_range: [
        this.rangeType,
        this.rangeStart,
        this.rangeEnd,
      ]
    };
  }

  toString(): string {
    return rangeToString(this);
  }
}

let nextQueryId = 0;

export class GeneQuery {
  private queryTopNode: GeneQueryNode;
  private queryId: number;

  private makeNode(parsedJson: any): GeneQueryNode {
    let nodeType = parsedJson['type'];
    if (nodeType === 'term') {
      let singleOrMulti =
        parsedJson.singleOrMultiAllele as TermAlleleSingleOrMulti;
      return new TermNode(parsedJson.termid, singleOrMulti);
    } else {
      if (nodeType === 'bool') {
        return new GeneBoolNode(parsedJson['operator'],
                                parsedJson.parts.map((json: any) => this.makeNode(json)));
      } else {
        throw new Error('Unknown type: ' + nodeType);
      }
    }
  }

  constructor(arg: Object) {
    this.queryId = nextQueryId++;
    if (arg instanceof GeneQueryNode) {
      this.queryTopNode = arg;
    } else {
      if (typeof(arg) === 'string') {
        throw new Error('GeneQuery constructor needs an Object not a string');
      }
      this.queryTopNode = this.makeNode(arg);
    }
  }

  public getQueryId(): number {
    return this.queryId;
  }

  public getTopNode(): GeneQueryNode {
    return this.queryTopNode;
  }

  public toJSON(): string {
    return JSON.stringify({
      'constraints': this.getTopNode().toObject(),
    });
  }

  public toString(): string {
    return this.getTopNode().toString();
  }
}
