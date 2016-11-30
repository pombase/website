export class QueryResultHeader {
  constructor(public names: string[]) { }
}

export class QueryResultRow {
  constructor(public elems: string[]) { }
}

export class PomBaseResults {
  constructor(
    public headers: QueryResultHeader,
    public rows: QueryResultRow[]) { }
}

export interface TermShort {
  termid: string;
  name: string;
  is_obsolete: boolean;
}

export class GeneSummary {
  uniquename: string;
  name: string;
  synonyms: Array<string>;
}

export enum QueryNodeOperator {
  And,
  Or
}

export type GeneUniquename = string;
export type Termid = string;

export class GeneQueryNode { }

export class GeneBoolNode {
  constructor(public operator: QueryNodeOperator,
              public childNodes: GeneQueryNode[]) {
  }

  getOperator(): QueryNodeOperator {
    return this.operator;
  }

  getChildNodes(): GeneQueryNode[] {
    return this.childNodes;
  }
}

export class GeneByTerm implements GeneQueryNode {
  constructor(public termid: Termid) { };
}

export class GeneQuery {
  private queryTopNode: GeneQueryNode;

  private makeNode(parsedJson: any): GeneQueryNode {
    if (parsedJson['type'] == 'term') {
      return new GeneByTerm(parsedJson.termid);
    } else {
      throw new Error("Unknown type: " + parsedJson['type']);
    }
  }

  constructor(parsedJson: Object) {
    if (typeof(parsedJson) == 'string') {
      throw new Error("GeneQuery constructor needs an Object not a string");
    }
    this.queryTopNode = this.makeNode(parsedJson);
  }

  public getTopNode(): GeneQueryNode {
    return this.queryTopNode;
  }
}
