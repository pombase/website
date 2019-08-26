import { Util } from './shared/util';
import { GeneShort } from './pombase-api.service';

export class TermAndName {
  termid: string;
  term: number;
  name: string;
}

export interface ResultRow {
  gene_uniquename: string;
  sequence?: string;
  subsets?: Array<TermId>;
  [other_attribute: string]: string | TermAndName | Array<TermId>;
}

export class QueryResult {
  constructor(
    private query: GeneQuery,
    private rows: ResultRow[]) { }

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

  constructor(public arg: Array<GeneShort> | Array<GeneUniquename>) {
    super();

    this.genes = [];

    for (let argElement of arg) {
      if (typeof(argElement) === 'object') {
        this.genes.push(GeneShort.fromGeneShort(argElement));
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

export class TermNode extends GeneQueryNode {
  constructor(private termid: string,
              private termName: string,
              private definition: string,
              private single_or_multi_allele: string,
              private expression: string) {
    super();
    if (single_or_multi_allele !== 'single') {
      this.expression = null;
    }
  };

  equals(obj: GeneQueryNode): boolean {
    if (obj instanceof TermNode) {
      return this.termid === obj.termid &&
        this.single_or_multi_allele === obj.single_or_multi_allele &&
        this.expression === obj.expression;
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
      }
    };
  }

  toString(): string {
    let ret = this.termName + ' (' + this.termid + ')';
    const singleOrMultiString = this.singleOrMultiString();
    const expressionString = this.expressionString();
    if (singleOrMultiString || expressionString) {
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
                          val['definition'], singleOrMulti, val.expression);

    case 'or':
    case 'and':
    case 'not':
      const parts = (val as Array<GeneQueryNode>).map((json: any) => this.nodeFromObj(json));
      return new GeneBoolNode(nodeType, parts);

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

  public equals(query: GeneQuery): boolean {
    return this.getTopNode().equals(query.getTopNode());
  }

  public getTopNode(): GeneQueryNode {
    return this.queryTopNode;
  }

  public toObject(): any {
    return {
      'constraints': this.getTopNode().toObject(),
    };
  }

  public getName(): string {
    return this.name;
  }

  private referencedTermsHelper(node: GeneQueryNode, collector: Array<TermShort>) {
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
  public referencedTerms(): Array<TermShort> {
    let collector: TermShort[] = [];
    this.referencedTermsHelper(this.getTopNode(), collector);
    return collector;
  }

  public toPostJSON(outputOptions: QueryOutputOptions): string {
    let obj = this.toObject();
    obj['output_options'] = outputOptions;
    return JSON.stringify(obj);
  }

  public toString(): string {
    if (this.stringQuery === null) {
      this.stringQuery = this.getTopNode().toString();
    }
    return this.stringQuery;
  }
}
