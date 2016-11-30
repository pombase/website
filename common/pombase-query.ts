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
  private operator: QueryNodeOperator;

  constructor(operator: string,
              public parts: GeneQueryNode[]) {

    if (operator.toLowerCase() == "and") {
      this.operator = QueryNodeOperator.And;
    } else {
      if (operator.toLowerCase() == "or") {
        this.operator = QueryNodeOperator.Or;
      } else {
        throw new Error("unknown operator: " + operator);
      }
    }
  }

  getOperator(): QueryNodeOperator {
    return this.operator;
  }

  getParts(): GeneQueryNode[] {
    return this.parts;
  }
}

export class GeneByTerm implements GeneQueryNode {
  constructor(public termid: Termid) { };
}

export class GeneQuery {
  private queryTopNode: GeneQueryNode;

  private makeNode(parsedJson: any): GeneQueryNode {
    let nodeType = parsedJson['type'];
    if (nodeType == 'term') {
      return new GeneByTerm(parsedJson.termid);
    } else {
      if (nodeType == 'bool') {
        return new GeneBoolNode(parsedJson['operator'],
                                parsedJson.parts.map((json: any) => this.makeNode(json)));
      } else {
        throw new Error("Unknown type: " + nodeType);
      }
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
