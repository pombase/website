import { Util } from './shared/util';
import { GeneShort } from './pombase-api.service';

export class TermAndName {
  termid: string;
  name: string;
}

export interface ResultRow {
  gene_uniquename: string;
  sequence?: string;
  subsets?: Array<TermId>;
  [other_attribute: string]: string | { term: TermAndName } | Array<TermId> | Array<string>;
}

export class QueryResult {
  constructor(
    private id: string,
    private query: GeneQuery,
    private rows: ResultRow[]) { }

  getId(): string {
    return this.id;
  }

  getQuery(): GeneQuery {
    return this.query;
  }

  getRows(): ResultRow[] {
    return this.rows;
  }

  getRowCount(): number {
    return this.getRows().length;
  }
}

export enum FormatTypes {
  FASTA,
}

export class FormatUtils {
  public static formatQueryResults(results: QueryResult, headers: { [key: string]: string }, format: FormatTypes) {
    let ret = '';

    if (format === FormatTypes.FASTA) {
      for (const row of results.getRows()) {
        if (row.sequence) {
          ret += '>' + headers[row.gene_uniquename] + '\n';
          ret += Util.splitSequenceString(row.sequence);
          ret += '\n';
        }
      }
    }

    return ret;
  }
}

export interface TermXref {
  xref_id: string,
  xref_display_name: string,
}

export interface TermShort {
  termid: TermId,
  name: string,
  definition: string,
  interesting_parents: Array<string>,
  is_obsolete: boolean;
  gene_count?: number;
  genotype_count?: number;
  xrefs: { [source_name: string]: TermXref };
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
  public abstract equals(obj: GeneQueryNode): boolean;
  public abstract toString(): string;
}

export class GeneBoolNode extends GeneQueryNode {
  private operator: QueryNodeOperator;

  constructor(operator: string,
              public parts: GeneQueryNode[]) {
    super();

    const sortParts = () => {
      parts.sort((a, b) => a.toString().localeCompare(b.toString()));
    };

    if (operator.toLowerCase() === 'and') {
      this.operator = QueryNodeOperator.And;
      sortParts();
    } else {
      if (operator.toLowerCase() === 'or') {
        this.operator = QueryNodeOperator.Or;
        sortParts();
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

  equals(obj: GeneQueryNode): boolean {
    if (obj instanceof GeneBoolNode) {
      return this.operator === obj.operator &&
        this.parts.length === obj.parts.length &&
        this.parts.every((v, i) => v.equals(obj.parts[i]));
    }
    return false;
  }

  getOperator(): QueryNodeOperator {
    return this.operator;
  }

  getParts(): GeneQueryNode[] {
    return this.parts;
  }

  toObject(): Object {
    let ret: { [key: string]: Array<Object> } = {};
    ret[QueryNodeOperator[this.operator].toLowerCase()] =
      this.getParts().map((part: GeneQueryNode) => part.toObject());
    return ret;
  }

  opString(): string {
    if (this.operator === QueryNodeOperator.And) {
      return 'AND';
    } else {
      if (this.operator === QueryNodeOperator.Or) {
        return 'OR';
      } else {
        return 'NOT';
      }
    }
  }

  toString(): string {
    return '(' + this.getParts().join(' ' + this.opString() + ' ') + ')';
  }
}

export class GeneListNode extends GeneQueryNode {
  genes: Array<GeneShort>;

  constructor(public arg: Array<{ uniquename: string }> | Array<GeneUniquename>) {
    super();

    this.genes = [];

    for (let argElement of arg) {
      if (typeof(argElement) === 'object') {
        this.genes.push({ uniquename: argElement.uniquename, name: null });
      } else {
        this.genes.push({ uniquename: argElement, name: null });
      }
    }

    this.genes = Array.from(new Set(this.genes)).sort();
  };

  toObject(): Object {
    return {
      gene_list: {
        genes: this.genes,
      },
    };
  }

  equals(obj: GeneQueryNode): boolean {
    if (obj instanceof GeneListNode) {
      return this.genes.length === obj.genes.length &&
        this.genes.every((v, i) => v.uniquename === obj.genes[i].uniquename);
    }
    return false;
  }

  toString(): string {
    let displayIds = this.genes.map(gene => gene.name || gene.uniquename);

    let retString = '';

    let i = 0;
    for (; i < displayIds.length; ++i) {
      const id = displayIds[i];
      if (retString.length > 100) {
        break;
      }

      if (retString !== '') {
        retString += ' ';
      }
      retString += id;
    }

    if (i < displayIds.length) {
      retString += ' ...';
    }
    return `gene list: [${retString}]`;
  }
}

function conditionsEqual(conditions1: Array<TermAndName>, conditions2: Array<TermAndName>): boolean {
  if (conditions1 === conditions2) {
    return true;
  }
  if (!conditions1 || !conditions2) {
    return false;
  }
  if (conditions1.length !== conditions2.length) {
    return false;
  }

  let set1 = new Set(conditions1.map(cond => cond.termid));
  let set2 = new Set(conditions2.map(cond => cond.termid));

  return [...Array.from(set1)].every(el1 => set2.has(el1));
}

export class TermNode extends GeneQueryNode {
  constructor(private termid: string,
              private termName: string,
              private definition: string,
              private single_or_multi_allele: string,
              private expression: string,
              private conditions: Array<TermAndName>) {
    super();
    if (single_or_multi_allele !== 'single') {
      this.expression = null;
    }
  };

  equals(obj: GeneQueryNode): boolean {
    if (obj instanceof TermNode) {
      return this.termid === obj.termid &&
        this.single_or_multi_allele === obj.single_or_multi_allele &&
        this.expression === obj.expression &&
        conditionsEqual(this.conditions, obj.conditions);
    }
    return false;
  }

  getTerm(): TermShort {
    return {
      termid: this.termid,
      name: this.termName,
      definition: this.definition
    } as TermShort;
  }

  getSingleOrMulti(): string {
    return this.single_or_multi_allele;
  }

  getConditions(): Array<TermAndName> {
    return this.conditions;
  }

  private singleOrMultiString(): string {
    if (this.single_or_multi_allele !== null) {
      const alleleValue = this.single_or_multi_allele.valueOf();
      if (alleleValue === 'both') {
        return 'single and multi';
      } else {
        return alleleValue;
      }
    }
    return null;
  }

  private expressionString(): string {
    if (this.expression) {
      switch (this.expression) {
      case 'wt-overexpressed':
        return 'Overexpressed wild-type';
      case 'null':
        return 'Null expression';
      }
    }
    return null;
  }

  private singleOrMultiAlleleForObject(): string {
    const valAsString = this.singleOrMultiString();
    if (valAsString) {
      if (valAsString === 'single and multi') {
        return 'both';
      } else {
        return valAsString;
      }
    } else {
      return null;
    }
  }

  private getConditionsString(): string {
    if (!this.conditions || this.conditions.length === 0) {
      return null;
    }
    return this.conditions
      .map(termShort => termShort.name + ' (' + termShort.termid + ')')
      .join(' and ');
  }

  toObject(): Object {
    const expression =
      this.single_or_multi_allele === 'single' ?
      this.expression :
      null;
    const singleOrMultiAllele = this.singleOrMultiAlleleForObject();
    return {
      term: {
        termid: this.termid,
        name: this.termName,
        single_or_multi_allele: singleOrMultiAllele,
        expression: expression,
        conditions: this.conditions,
      }
    };
  }

  toString(): string {
    let ret = this.termName + ' (' + this.termid + ')';
    const singleOrMultiString = this.singleOrMultiString();
    const expressionString = this.expressionString();
    const conditionsString = this.getConditionsString();
    if (singleOrMultiString || expressionString || conditionsString) {
      ret += ' [';
      if (this.single_or_multi_allele === 'single' && expressionString) {
        ret += expressionString;
        if (singleOrMultiString) {
          ret += ' - ';
        }
      }
      if (singleOrMultiString) {
        ret += singleOrMultiString + ' allele genotypes';
      }
      if (conditionsString) {
        if (ret.length > 2) {
          ret += ' - ';
        }
        ret += 'conditions: ' + conditionsString;
      }
      ret += ']';
    }
    return ret;
  }
}

export class SubsetNode extends GeneQueryNode {
  constructor(public subsetName: string,
              public subsetDisplayName: string) {
    super();
  };

  equals(obj: GeneQueryNode): boolean {
    if (obj instanceof SubsetNode) {
      return this.subsetName === obj.subsetName;
    }
    return false;
  }

  toObject(): Object {
    return {
      'subset': { subset_name: this.subsetName },
    };
  }

  toString(): string {
    if (this.subsetDisplayName) {
      return 'subset: ' + this.subsetDisplayName;
    } else {
      return 'subset: ' + this.subsetName;
    }
  }
}

function rangeToString(rangeNode: RangeNode) {
  let returnVal = rangeNode.rangeType;
  if (!rangeNode.rangeEnd) {
    returnVal += '(\u2265' + rangeNode.rangeStart + ')';
  } else {
    if (!rangeNode.rangeStart) {
      returnVal += '(\u2264' + rangeNode.rangeEnd + ')';
    } else {
      if (rangeNode.rangeStart === rangeNode.rangeEnd) {
        returnVal += '(' + rangeNode.rangeStart + ')';
      } else {
        returnVal += '(' + rangeNode.rangeStart + '..' + rangeNode.rangeEnd + ')';
      }
    }
  }

  return returnVal;
}

export abstract class RangeNode extends GeneQueryNode {
  constructor(public rangeType: string,
              public rangeStart: number, public rangeEnd: number) {
    super();
  };

  equals(obj: GeneQueryNode): boolean {
    if (obj instanceof RangeNode) {
      return this.toString() === obj.toString();
    }
    return false;
  }
}

export class InteractorsNode extends GeneQueryNode {
  constructor(public geneUniquename: string, public interactionType: string) {
    super();
  }

  toObject(): Object {
    return {
      'interactors': { 'gene_uniquename': this.geneUniquename,
                       'interaction_type': this.interactionType }
    };
  }

  equals(obj: GeneQueryNode): boolean {
    if (obj instanceof InteractorsNode) {
      return this.geneUniquename === obj.geneUniquename &&
        this.interactionType === obj.interactionType;
    }
    return false;
  }

  toString(): string {
    return `${this.interactionType}_interactors_of: ${this.geneUniquename}`;
  }
}

export class GenomeRangeNode extends GeneQueryNode {
  constructor(private start: number, private end: number, private chromosomeName: string) {
    super();
  }

  toObject(): Object {
    return {
      'genome_range': { start: this.start, end: this.end,
                        chromosome_name: this.chromosomeName }
    };
  }

  equals(obj: GeneQueryNode): boolean {
    if (obj instanceof GenomeRangeNode) {
      return this.chromosomeName === obj.chromosomeName &&
        this.start === obj.start && this.end === obj.end;
    }
    return false;
  }

  toString(): string {
    if (this.start || this.end) {
      if (!this.start) {
        return `genome_range: <= ${this.end} of ${this.chromosomeName}`;
      } else {
        if (!this.end) {
          return `genome_range: >= ${this.start} of ${this.chromosomeName}`;
        } else {
          return `genome_range: ${this.start}..${this.end} of ${this.chromosomeName}`;
        }
      }
    } else {
      return `all_genes_from_chromosome: ${this.chromosomeName}`;
    }
  }
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

export class QueryIdNode extends GeneQueryNode {
  constructor(private id: string) {
    super();
  }

  toObject(): Object {
    return {
      query_id: this
    }
  }

  toString(): string {
    return `query_id: ${this.id}`;
  }

  equals(obj: GeneQueryNode): boolean {
    return obj instanceof QueryIdNode && obj.id === this.id;
  }
}

type SequenceOptions = 'protein' | 'none' | {
  nucleotide: {
    include_introns: boolean,
    include_5_prime_utr: boolean,
    include_3_prime_utr: boolean,
  },
};

export class QueryOutputOptions {
  constructor(private field_names: Array<string>,
              private flags: Array<string>,
              private sequence: SequenceOptions) { }
}

export class GeneQuery {
  private queryTopNode: GeneQueryNode;
  private name: string;
  private stringQuery: string = null;

  static fromJSONString(arg: { name: string, constraints: string }): GeneQuery {
    if (typeof(arg) === 'string') {
      throw new Error('GeneQuery constructor needs an Object not a string');
    }
    if (arg['constraints']) {
      return new GeneQuery(arg['name'], this.nodeFromObj(arg['constraints']))
    } else {
      return new GeneQuery(null, this.nodeFromObj(arg));
    }
  }

  private static nodeFromObj(parsedJson: any): GeneQueryNode {
    const keys = Object.keys(parsedJson);
    if (keys.length !== 1) {
      throw new Error('parsedJson doesn\'t have exactly one key' + parsedJson);
    }
    const nodeType = keys[0];
    const val = parsedJson[nodeType];

    switch (nodeType) {

    case 'term':
      let singleOrMulti = val['single_or_multi_allele'];
      return new TermNode(val['termid'], val['name'],
                          val['definition'], singleOrMulti, val.expression,
                          val['conditions']);

    case 'or':
    case 'and': {
      const parts = (val as Array<GeneQueryNode>).map((json: any) => this.nodeFromObj(json));
      return new GeneBoolNode(nodeType, parts);
    }
    case 'not':
      if (val instanceof Array) {
        const parts = (val as Array<GeneQueryNode>).map((json: any) => this.nodeFromObj(json));
        return new GeneBoolNode(nodeType, parts);
      } else {
        const parts = (val as { node_a: any; node_b: any; });
        const jsonA = parts['node_a'];
        const jsonB = parts['node_b'];
        const nodes = [this.nodeFromObj(jsonA), this.nodeFromObj(jsonB)];
        return new GeneBoolNode(nodeType, nodes);
      }

    case 'subset':
      return new SubsetNode(val['subset_name'], null);

    case 'int_range':
      return new IntRangeNode(val['range_type'], val['start'], val['end']);

    case 'float_range':
      return new FloatRangeNode(val['range_type'], val['start'], val['end']);

    case 'gene_list':
      return new GeneListNode(val['genes'] || val['ids']);

    case 'interactors':
      return new InteractorsNode(val['gene_uniquename'], val['interaction_type']);

    case 'genome_range':
      return new GenomeRangeNode(val['start'], val['end'], val['chromosome_name']);
    }

    throw new Error('Unknown type: ' + nodeType);
  }

  constructor(queryName: string, topNode: GeneQueryNode) {
    this.name = queryName;
    this.queryTopNode = topNode;

    this.stringQuery = this.getTopNode().toString();
  }

  static fromGeneUniquenames(queryName: string, geneUniquenames: Array<GeneUniquename>): GeneQuery {
    const part = new GeneListNode(geneUniquenames);
    return new GeneQuery(queryName, part);
  }

  public equals(query: GeneQuery): boolean {
    return this.getTopNode().equals(query.getTopNode());
  }

  public getTopNode(): GeneQueryNode {
    return this.queryTopNode;
  }

  public toObject(): any {
    return {
      name: this.getName(),
      constraints: this.getTopNode().toObject(),
    };
  }

  public getName(): string {
    return this.name;
  }

  public setName(name: string) {
    this.name = name;
  }

  private referencedTermsHelper(node: GeneQueryNode, collector: Array<TermAndName>) {
    if (node instanceof TermNode) {
      collector.push(node.getTerm());
    } else {
      if (node instanceof GeneBoolNode) {
        for (const part of node.getParts()) {
          this.referencedTermsHelper(part, collector);
        }
      }
    }
  }

  // return an Array of all terms referenced by TermNodes in this query
  public referencedTerms(): Array<TermAndName> {
    let collector: TermAndName[] = [];
    this.referencedTermsHelper(this.getTopNode(), collector);
    return collector;
  }

  public toPostJSON(outputOptions: QueryOutputOptions = null): string {
    let obj = this.toObject();
    obj['output_options'] = outputOptions || {};
    return JSON.stringify(obj);
  }

  public toString(): string {
    if (this.stringQuery === null) {
      this.stringQuery = this.getTopNode().toString();
    }
    return this.stringQuery;
  }
}
