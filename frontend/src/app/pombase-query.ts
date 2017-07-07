export interface ResultRow {
  gene_uniquename: string;
}

export class QueryResult {
  constructor(
    public status: string,
    public rows: ResultRow[]) { }
}

export interface TermShort {
  termid: TermId;
  name: string;
  definition?: string;
  interesting_parents: Array<string>;
  is_obsolete: boolean;
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
      'genelist': this.genes,
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

export class TermNode extends GeneQueryNode {
  constructor(public term: TermShort) {
    super();
  };

  toObject(): Object {
    return {
      'termid': this.term.termid,
    };
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
    if (this.subsetDisplayName !== this.subsetName) {
      return `${this.subsetDisplayName} ${this.subsetName}`;
    } else {
      return this.subsetDisplayName;
    }
  }
}

export class GeneQuery {
  private queryTopNode: GeneQueryNode;

  private makeNode(parsedJson: any): GeneQueryNode {
    let nodeType = parsedJson['type'];
    if (nodeType === 'term') {
      return new TermNode(parsedJson.termid);
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
    if (arg instanceof GeneQueryNode) {
      this.queryTopNode = arg;
    } else {
      if (typeof(arg) === 'string') {
        throw new Error('GeneQuery constructor needs an Object not a string');
      }
      this.queryTopNode = this.makeNode(arg);
    }
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
