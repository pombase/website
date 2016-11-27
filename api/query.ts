let lunr = require('lunr');
import fs = require('fs');

export class Indices {
  [cvName: string]: any;
}

export class QueryHandler {
  private termsByID: any = {};
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
    let termsByID = this.termsByID;
    let index = this.allIndices[cvName];
    let matches = index.search(queryText).slice(0, 20);

    return matches.map(
      (match) => {
        let term = termsByID[match.ref];
        return {
          termid: term.termid,
          name: term.name,
        }
      });
  }

  genesByTermid(termid: string) {
    return this.searchMaps.termid_genes[termid];
  }

  jsonQuery(query: any) {
    return {
      genes: ['a1', 'a2']
    }
  }
}
