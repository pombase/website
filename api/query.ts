let lunr = require('lunr');
import fs = require('fs');

export function setUnion<T>(a: Set<T>, b: Set<T>): Set<T> {
  var union = new Set(a);
  for (var elem of b) {
    union.add(elem);
  }
  return union;
}

export function setIntersection<T>(a: Set<T>, b: Set<T>): Set<T> {
  var intersection = new Set();
  for (var elem of b) {
    if (a.has(elem)) {
      intersection.add(elem);
    }
  }
  return intersection;
}

import {
  GeneQuery, GeneQueryNode, GeneBoolNode, GeneSummary, PomBaseResults, GeneUniquename,
  GeneByTerm, QueryResultHeader, QueryResultRow, QueryResultElement,
} from '../common/pombase-query';

export class Indices {
  [cvName: string]: any;
}

export class QueryHandler {
  private termsByID: any = {};
  private genesByUniquename: any = {};
  private allIndices: Indices;
  private searchMaps: {
    "term_summaries": any,
    "gene_summaries": any,
    "term_name_genes": any,
    "termid_genes": any,
  };

  constructor(directory: string) {
    let searchMapsJSON = fs.readFileSync(directory + "/search_api_maps.json", "utf8");
    this.searchMaps = JSON.parse(searchMapsJSON);
    this.allIndices = this.makeAll(this.searchMaps);

    for (let termSummary of this.searchMaps.term_summaries) {
      this.termsByID[termSummary.termid] = termSummary;
    }
    for (let geneSummary of this.searchMaps.gene_summaries) {
      this.genesByUniquename[geneSummary.uniquename] = geneSummary;
    }
  }

  makeAll(searchMaps: any): Indices {
    let indices: any = {};

    for (let termSummary of searchMaps.term_summaries) {
      let cvName = termSummary.cv_name;

      if (!indices[cvName]) {
        indices[cvName] =
          lunr(function () {
            this.field('name')
            this.ref('termid')
          })
      }

      let index = indices[cvName];

      index.add({
        name: termSummary.name,
        termid: termSummary.termid,
      });
    }

    return indices;
  }

  genesByTermNameFuzzy(cvName:string, queryText: string) {
    let index = this.allIndices[cvName];
    let matches = index.search(queryText).slice(0, 20);

    return matches.map(
      (match: any) => {
        let term = this.termsByID[match.ref];
        return {
          termid: term.termid,
          name: term.name,
        }
      });
  }

  genesByTermid(termid: string) {
    return this.searchMaps.termid_genes[termid];
  }

  processBoolNode(boolNode: GeneBoolNode) {
    for (let node of boolNode.getChildNodes()) {
      let newGenes = this.processNode(node);
    }

  }

  processNode(node: GeneQueryNode): GeneUniquename[] {
    if (node instanceof GeneByTerm) {
      let termid = node.termid;
      return this.searchMaps.termid_genes[termid];
    } else {
      console.log("in getGenesOfPart() - unknown query part type");
    }
  }

  geneQuery(query: GeneQuery): PomBaseResults {
    let topNode = query.getTopNode();
    let geneUniquenames: string[] = this.processNode(topNode);
    let header = new QueryResultHeader(["Gene systematic ID", "Gene name"]);
    let rows =
      geneUniquenames.map((geneUniquename: GeneUniquename) => {
        let geneSummary = this.genesByUniquename[geneUniquename];
        let rowParts =
          [new QueryResultElement(geneUniquename),
           new QueryResultElement(geneSummary.name)];
        return new QueryResultRow(rowParts);
      });

    return new PomBaseResults(header, rows);
  }
}
