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
            console.log('A NOT query must have 2 parts');
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
      gene_list: {
        ids: this.genes,
      }
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
  constructor(private termid: string,
              private termName: string,
              private definition: string,
              private singleOrMultiAllele: TermAlleleSingleOrMulti,
              private expression: string) {
    super();
  };

  getTerm(): TermShort {
    return new TermShort(this.termid, this.termName, this.definition,
                         [], false);
  }

  getSingleOrMulti(): TermAlleleSingleOrMulti {
    return this.singleOrMultiAllele;
  }

  toObject(): Object {
    let singleOrMultiAllele =
      this.singleOrMultiAllele ?
      this.singleOrMultiAllele.toString().toLowerCase() :
      null;

    return {
      term: {
        termid: this.termid,
        name: this.termName,
        single_or_multi_allele: singleOrMultiAllele,
        expression: this.expression
      }
    };
  }

  toString(): string {
    return `${this.termName} ${this.termid}`;
  }
}

export class SubsetNode extends GeneQueryNode {
  constructor(public subsetName: string,
              public subsetDisplayName: string) {
    super();
  };

  toObject(): Object {
    return {
      'subset': { subset_name: this.subsetName },
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
      int_range: {
        range_type: this.rangeType,
        start: this.rangeStart != null ? Math.floor(this.rangeStart) : null,
        end: this.rangeEnd != null ? Math.floor(this.rangeEnd) : null,
      }
    };
  }

  toString(): string {
    return rangeToString(this);
  }
}

export class FloatRangeNode extends RangeNode {
  toObject(): Object {
    return {
      float_range: {
        range_type: this.rangeType,
        start: this.rangeStart,
        end: this.rangeEnd,
      }
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
    const keys = Object.keys(parsedJson);
    if (keys.length != 1) {
      throw new Error('parsedJson doesn\'t have exactly one key' + parsedJson);
    }
    const nodeType = keys[0];
    const val = parsedJson[nodeType];

    switch(nodeType) {

    case 'term':
      let singleOrMulti =
        val['single_or_multi_allele'] as TermAlleleSingleOrMulti;
      return new TermNode(val['termid'], val['name'],
                          val['definition'], singleOrMulti, val.expression);

    case 'or':
    case 'and':
    case 'not':
      const parts = (val as Array<GeneQueryNode>).map((json: any) => this.makeNode(json));
      return new GeneBoolNode(nodeType, parts);

    case 'subset':
      return new SubsetNode(val['subset_name'], null);

    case 'int_range':
      return new IntRangeNode(val['range_type'], val['start'], val['end']);

    case 'float_range':
      return new FloatRangeNode(val['range_type'], val['start'], val['end']);

    }

    throw new Error('Unknown type: ' + nodeType);
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

  public toObject(): any {
    return {
      'constraints': this.getTopNode().toObject(),
    }
  }

  public toJSON(): string {
    return JSON.stringify(this.toObject());
  }

  public toString(): string {
    return this.getTopNode().toString();
  }
}
