export interface TermShort {
  termid: string,
  name: string,
  is_obsolete: boolean,
}

export class TermQueryPart {
  constructor(public term: TermShort) {};
}

export interface GeneQueryPart { }

export class GeneQuery {
  private queryParts: GeneQueryPart[] = [];

  constructor(json: string = '[]') {
    let parsedJson = JSON.parse(json);

    console.log(parsedJson);
  }

  getQueryParts(): GeneQueryPart[] {
    return this.queryParts;
  }
}
