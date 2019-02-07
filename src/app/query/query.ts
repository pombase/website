export interface QueryNotPart {
  part1: QueryPart;
  part2: QueryPart;
}

export interface QueryPart {
  and: Array<QueryPart>;
  or: Array<QueryPart>;
  not: QueryNotPart;
  termid: string;
}

export interface Query {
  top: QueryPart;
}
