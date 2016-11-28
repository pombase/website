export class QueryResultHeader {
  constructor(public names: string[]) { }
}

export class QueryResultElement {
  constructor(public val: string) { }
}

export class QueryResultRow {
  constructor(public vals: QueryResultElement[]) { }
}

export class PomBaseResults {
  constructor(
    public headers: QueryResultHeader,
    public rows: QueryResultRow[]) { }
}

export interface TermShort {
  termid: string,
  name: string,
  is_obsolete: boolean,
}

export class GeneSummary {
  uniquename: string;
  name: string;
  synonyms: Array<string>;
}

export enum QueryPartOperator {
  And,
  Or
}

export type GeneUniquename = string;
export type Termid = string;

export interface GeneQueryPart { }

export class GeneByTerm implements GeneQueryPart {
  public operator: QueryPartOperator;

  constructor(public termid: Termid,
              operator: QueryPartOperator) {
    this.operator = operator;
  };
}

export class GeneQuery {
  private queryParts: GeneQueryPart[] = [];

  constructor(parsedJson: any) {
    console.log(parsedJson);
  }

  public getQueryParts(): GeneQueryPart[] {
    return this.queryParts;
  }
}
