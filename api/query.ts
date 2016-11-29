let lunr = require('lunr');
import fs = require('fs');

import {
  GeneQuery, GeneQueryPart, GeneSummary, PomBaseResults, GeneUniquename,
  GeneByTerm, QueryResultHeader, QueryResultRow, QueryResultElement,
} from './common/pombase-query';

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

  getGenesOfPart(part: GeneQueryPart): GeneUniquename[] {
    if (part instanceof GeneByTerm) {
      let termid = part.termid;
      return this.searchMaps.termid_genes[termid];
    } else {
      console.log("in getGenesOfPart() - unknown query part type");
    }
  }

  geneQuery(query: GeneQuery): PomBaseResults {
    let parts = query.getQueryParts();
    if (parts.length == 0) {
      return new PomBaseResults(new QueryResultHeader(["Systematic ID"]), []);
    }

    let geneUniquenames: string[] = this.getGenesOfPart(parts.shift());

    for (let queryPart of parts) {
      let newGenes = this.getGenesOfPart(queryPart);
    }

    let header = new QueryResultHeader(["Gene systematic ID"]);
    let rows =
      geneUniquenames.map((geneUniquename) => {
        let geneSummary = this.genesByUniquename[geneUniquename];
        let rowParts =
          [new QueryResultElement(geneUniquename),
           new QueryResultElement(geneSummary.name)];
        return new QueryResultRow(rowParts);
      });

    return new PomBaseResults(header, rows);
  }
}
