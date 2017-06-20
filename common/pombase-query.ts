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
  interesting_parents: Array<string>;
  is_obsolete: boolean;
}

export class GeneSummary {
  uniquename: string;
  name: string;
  synonyms: Array<string>;
  product: string;
}

export enum QueryNodeOperator {
  And,
  Or
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
        throw new Error('unknown operator: ' + operator);
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
    if (this.operator == QueryNodeOperator.And) {
      return 'INTERSECT';
    } else {
      return 'UNION';
    }
  }

  toString(): string {
    return '(' + this.getParts().join(' ' + this.opString() + ' ') + ')';
  }
}

export class TermNode extends GeneQueryNode {
  constructor(public term: TermShort) {
    super()
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
      "constraints": this.getTopNode().toObject(),
    })
  }

  public toString(): string {
    return this.getTopNode().toString();
  }
}
