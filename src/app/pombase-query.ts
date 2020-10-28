import { Util } from './shared/util';
import { GeneShort } from './pombase-api.service';
import { QueryOutputOptions, DisplayResultRow } from './query.service';

export class TermAndName {
  termid: string;
  name: string;
}

export interface ResultRow {
  gene_uniquename: string;
  sequence?: string;
  gaf_lines?: Array<string>;
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
  public static formatQueryResults(results: DisplayResultRow[], headers: { [key: string]: string }, format: FormatTypes) {
    let ret = '';

    if (format === FormatTypes.FASTA) {
      for (const row of results) {
        if (row.sequence) {
          ret += '>' + headers[row.uniquename] + '\n';
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
  interesting_parent_ids: Array<string>,
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

export class GeneQueryBase {
  constructor(private nodeName: string) {
  }

  public getNodeName(): string {
    return this.nodeName;
  }

  public setNodeName(nodename: string): void {
    this.nodeName = nodename;
  }
}

export interface GeneQueryNode {
  getNodeName(): string;
  setNodeName(newName: string): void;
  toObject(): Object;
  equals(obj: GeneQueryNode): boolean;
  detailsString(): string;
}

export class GeneBoolNode extends GeneQueryBase implements GeneQueryNode {
  private operator: QueryNodeOperator;

  constructor(nodeName: string, operator: string,
              public parts: GeneQueryNode[]) {

    super(nodeName);
    if (!nodeName) {
      this.setNodeName(this.detailsString());
    }

    if (!nodeName) {
      let newNodeNameParts: Array<string> = [];

      parts.map(part => {
        const partName = part.getNodeName();
        if (partName) {
          if (newNodeNameParts) {
            if (part instanceof GeneBoolNode) {
              newNodeNameParts.push('(' + partName + ')');
            } else {
              newNodeNameParts.push(partName);
            }
          }
        } else {
          newNodeNameParts = null;
        }
      });

      if (newNodeNameParts) {
        nodeName = newNodeNameParts.join(' ' + operator.toUpperCase() + ' ');
      }
    }

    this.setNodeName(nodeName);

    const sortParts = () => {
      parts.sort((a, b) => a.detailsString().localeCompare(b.detailsString()));
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

    this._detailsString = '(' +
      this.getParts().map(node => node.detailsString()).join(' ' + this.opString() + ' ') + ')';
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
    let ret: { [key: string]: any } = {};
    ret[QueryNodeOperator[this.operator].toLowerCase()] =
      this.getParts().map((part: GeneQueryNode) => part.toObject());
    ret['node_name'] = this.getNodeName();
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

  private _detailsString: string;
  detailsString(): string {
    return this._detailsString;
  }
}

export class GeneListNode extends GeneQueryBase implements GeneQueryNode {
  genes: Array<GeneShort>;

  constructor(nodeName: string, public arg: Array<{ uniquename: string }> | Array<GeneUniquename>) {
    super(nodeName);
    if (!nodeName) {
      this.setNodeName(this.detailsString());
    }

    this.genes = [];

    for (let argElement of arg) {
      if (typeof(argElement) === 'object') {
        this.genes.push({ uniquename: argElement.uniquename, name: null });
      } else {
        this.genes.push({ uniquename: argElement, name: null });
      }
    }

    this.genes = Array.from(new Set(this.genes)).sort();

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

    this._detailsString = `gene list: [${retString}]`;
  };

  toObject(): Object {
    return {
      node_name: this.getNodeName(),
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

  private _detailsString: string;
  detailsString(): string {
    return this._detailsString;
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

export class TermNode extends GeneQueryBase implements GeneQueryNode {
  constructor(nodeName: string,
              private termid: string,
              private termName: string,
              private definition: string,
              private single_or_multi_allele: string,
              private expression: string,
              private conditions: Array<TermAndName>,
              private excludedConditions: Array<TermAndName>) {
    super(nodeName);

    if (single_or_multi_allele !== 'single') {
      this.expression = null;
    }

    this.setDetailsString();

    if (!nodeName) {
      this.setNodeName(this.detailsString());
    }
  };

  equals(obj: GeneQueryNode): boolean {
    if (obj instanceof TermNode) {
      return this.termid === obj.termid &&
        this.single_or_multi_allele === obj.single_or_multi_allele &&
        this.expression === obj.expression &&
        conditionsEqual(this.conditions, obj.conditions) &&
        conditionsEqual(this.excludedConditions, obj.excludedConditions);
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

  private getConditionsString(conditions: Array<TermAndName>): string {
    if (!conditions || conditions.length === 0) {
      return null;
    }
    return conditions
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
      node_name: this.getNodeName(),
      term: {
        termid: this.termid,
        name: this.termName,
        single_or_multi_allele: singleOrMultiAllele,
        expression: expression,
        conditions: this.conditions,
        excluded_conditions: this.excludedConditions,
      }
    };
  }

  private setDetailsString(): void {
    let ret = this.termName + ' (' + this.termid + ')';
    const singleOrMultiString = this.singleOrMultiString();
    const expressionString = this.expressionString();
    const conditionsString = this.getConditionsString(this.conditions);
    const excludedConditionsString = this.getConditionsString(this.excludedConditions);

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
      if (excludedConditionsString) {
        if (ret.length > 2) {
          ret += ' - ';
        }
        ret += 'excluded conditions: ' + excludedConditionsString;
      }
      ret += ']';
    }

    this._detailsString = ret;
  }

  private _detailsString: string;
  detailsString(): string {
    return this._detailsString;
  }
}

export class SubsetNode extends GeneQueryBase implements GeneQueryNode {
  constructor(nodeName: string, public subsetName: string) {
    super(nodeName);
    if (!nodeName) {
      this.setNodeName(this.detailsString());
    }
  };

  equals(obj: GeneQueryNode): boolean {
    if (obj instanceof SubsetNode) {
      return this.subsetName === obj.subsetName;
    }
    return false;
  }

  toObject(): Object {
    return {
      node_name: this.getNodeName(),
      subset: { subset_name: this.subsetName },
    };
  }

  detailsString(): string {
    return 'subset: ' + this.subsetName;
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

export abstract class RangeNode extends GeneQueryBase {
  constructor(nodeName: string, public rangeType: string,
              public rangeStart: number, public rangeEnd: number) {
    super(nodeName);
    if (!nodeName) {
      this.setNodeName(this.detailsString());
    }
  };

  equals(obj: GeneQueryNode): boolean {
    if (obj instanceof RangeNode) {
      return this.detailsString() === obj.detailsString();
    }
    return false;
  }

  public abstract detailsString(): string;
}

export class InteractorsNode extends GeneQueryBase implements GeneQueryNode {
  constructor(nodeName: string, public geneUniquename: string, public interactionType: string) {
    super(nodeName);
    if (!nodeName) {
      this.setNodeName(this.detailsString());
    }
  }

  toObject(): Object {
    return {
      node_name: this.getNodeName(),
      interactors: { 'gene_uniquename': this.geneUniquename,
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

  detailsString(): string {
    return `${this.interactionType}_interactors_of: ${this.geneUniquename}`;
  }
}

export class GenomeRangeNode extends GeneQueryBase implements GeneQueryNode {
  constructor(nodeName: string,
              private start: number, private end: number, private chromosomeName: string) {
    super(nodeName);

    this.setDetailsString();

    if (!nodeName) {
      this.setNodeName(this.detailsString());
    }
  }

  toObject(): Object {
    return {
      node_name: this.getNodeName(),
      genome_range: { start: this.start, end: this.end,
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

  private setDetailsString(): void {
    let ret = '';
    if (this.start || this.end) {
      if (!this.start) {
        ret = `genome_range: <= ${this.end} of ${this.chromosomeName}`;
      } else {
        if (!this.end) {
          ret = `genome_range: >= ${this.start} of ${this.chromosomeName}`;
        } else {
          ret = `genome_range: ${this.start}..${this.end} of ${this.chromosomeName}`;
        }
      }
    } else {
      ret = `all_genes_from_chromosome: ${this.chromosomeName}`;
    }

    this._detailsString = ret;
  }

  private _detailsString: string;
  detailsString(): string {
    return this._detailsString;
  }
}

export class IntRangeNode extends RangeNode implements GeneQueryNode {
  toObject(): Object {
    return {
      node_name: this.getNodeName(),
      int_range: {
        range_type: this.rangeType,
        start: this.rangeStart != null ? Math.floor(this.rangeStart) : null,
        end: this.rangeEnd != null ? Math.floor(this.rangeEnd) : null,
      }
    };
  }

  detailsString(): string {
    return rangeToString(this);
  }
}

export class FloatRangeNode extends RangeNode {
  toObject(): Object {
    return {
      node_name: this.getNodeName(),
      float_range: {
        range_type: this.rangeType,
        start: this.rangeStart,
        end: this.rangeEnd,
      }
    };
  }

  detailsString(): string {
    return rangeToString(this);
  }
}

export class QueryIdNode extends GeneQueryBase implements GeneQueryNode {
  constructor(nodeName: string, private id: string) {
    super(nodeName);
    if (!nodeName) {
      this.setNodeName(this.detailsString());
    }
  }

  toObject(): Object {
    return {
      node_name: this.getNodeName(),
      query_id: { id: this.id }
    }
  }

  detailsString(): string {
    return `query_id: ${this.id}`;
  }

  equals(obj: GeneQueryNode): boolean {
    return obj instanceof QueryIdNode && obj.id === this.id;
  }
}

export class GeneQuery {
  private queryTopNode: GeneQueryNode;
  private stringQuery: string = null;

  static fromJSONString(arg: { name: string, constraints: string }): GeneQuery {
    let constraints = this.nodeFromObj(arg.name, arg.constraints);
    return new GeneQuery(constraints);
  }

  private static nodeFromObj(queryName: string, parsedJson: any): GeneQueryNode {
    let nodeName = parsedJson['node_name'];
    delete parsedJson['node_name'];
    if (queryName) {
      // cope with legacy saved queries
      nodeName = queryName;
    }
    const keys = Object.keys(parsedJson);
    if (keys.length !== 1) {
      throw new Error('parsedJson doesn\'t have exactly one key' + parsedJson);
    }
    const nodeType = keys[0];
    const val = parsedJson[nodeType];

    switch (nodeType) {

    case 'term':
      const singleOrMulti = val['single_or_multi_allele'];
      return new TermNode(nodeName, val['termid'], val['name'],
                          val['definition'], singleOrMulti, val.expression,
                          val['conditions'], val['excluded_conditions']);

    case 'or':
    case 'and': {
      const parts = (val as Array<any>).map((json: any) => this.nodeFromObj(null, json));
      return new GeneBoolNode(nodeName, nodeType, parts);
    }
    case 'not':
      if (val instanceof Array) {
        const parts = (val as Array<GeneQueryNode>).map((json: any) => this.nodeFromObj(null, json));
        return new GeneBoolNode(nodeName, nodeType, parts);
      } else {
        const parts = (val as { node_a: any; node_b: any; });
        const jsonA = parts['node_a'];
        const jsonB = parts['node_b'];
        const nodes = [this.nodeFromObj(null, jsonA), this.nodeFromObj(null, jsonB)];
        return new GeneBoolNode(nodeName, nodeType, nodes);
      }

    case 'subset':
      return new SubsetNode(nodeName, val['subset_name']);

    case 'int_range':
      return new IntRangeNode(nodeName, val['range_type'], val['start'], val['end']);

    case 'float_range':
      return new FloatRangeNode(nodeName, val['range_type'], val['start'], val['end']);

    case 'gene_list':
      return new GeneListNode(nodeName, val['genes'] || val['ids']);

    case 'interactors':
      return new InteractorsNode(nodeName, val['gene_uniquename'], val['interaction_type']);

    case 'genome_range':
      return new GenomeRangeNode(nodeName, val['start'], val['end'], val['chromosome_name']);
    }

    throw new Error('Unknown type: ' + nodeType);
  }

  static fromGeneUniquenames(queryName: string, geneUniquenames: Array<GeneUniquename>): GeneQuery {
    const part = new GeneListNode(queryName, geneUniquenames);
    return new GeneQuery(part);
  }

  constructor(topNode: GeneQueryNode) {
    this.queryTopNode = topNode;

    this.stringQuery = this.getTopNode().detailsString();
  }

  public equals(query: GeneQuery): boolean {
    return this.getTopNode().equals(query.getTopNode());
  }

  public getTopNode(): GeneQueryNode {
    return this.queryTopNode;
  }

  public toObject(): any {
    return {
      constraints: this.getTopNode().toObject(),
    };
  }

  public getQueryName(): string {
    return this.getTopNode().getNodeName();
  }

  public setQueryName(newName: string) {
    this.getTopNode().setNodeName(newName);
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
      this.stringQuery = this.getTopNode().detailsString();
    }
    return this.stringQuery;
  }
}
