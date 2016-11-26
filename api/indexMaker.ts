let lunr = require('lunr');

export interface Indices {
  [cvName: string]: any;
}

export function makeAll(searchMaps: any): Indices {
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
