import 'mocha';

var expect = require('chai').expect;

import { QueryHandler, setUnion, setIntersection } from '../query';
import { TermShort, GeneQuery,
         GeneByTerm, QueryNodeOperator } from '../../common/pombase-query';

var assert = require('assert');

describe('setUnion', function() {
  it('is union', function() {
    expect(Array.from(setUnion(new Set([1,2,3]), new Set([2,3,4]))))
      .to.have.members([1,2,3,4]);
  })
})

describe('setIntersection', function() {
  it('is intersection', function() {
    expect(Array.from(setIntersection(new Set([1,2,3]), new Set([2,3,4]))))
      .to.have.members([2,3]);
  })
})

describe('GeneQuery', function() {
  it('should create a GeneQuery from an object', function() {
    expect(function() {
      let geneQuery = new GeneQuery('{"type": "term", "termid": "GO:0005515"}');
    }).to.throw('GeneQuery constructor needs an Object not a string');
  });
});

describe('GeneQuery', function() {
  it('should create a GeneQuery from an object', function() {
    let geneQuery = new GeneQuery({"type": "term", "termid": "GO:0005515"});
    let topNode = geneQuery.getTopNode();
    if (topNode instanceof GeneByTerm) {
      expect(topNode.termid).to.equal("GO:0005515");
    } else {
      throw new Error("node is not a GeneByTerm");
    }
  });
});

describe('QueryHandler', function() {
  var qh = new QueryHandler('./tests/data');
  const genesOfGo0005515 = ['SPAC1F7.04', 'SPCC1739.11c', 'SPAC6F6.08c'];

  describe('#genesByTermid()', function() {
    it('should return 3 genes', function() {
      let res = qh.genesByTermid('GO:0005515');
      expect(res).to.have.members(genesOfGo0005515);
    })
  });

  describe('#genesByTermNameFuzzy()', function() {
    it('should return term data', function() {
      let res = qh.genesByTermNameFuzzy('biological_process', 'regul bio');
      expect(res.map((details: TermShort) => details.termid))
             .to.have.members(['GO:0031328', 'GO:0032949']);
    })
  });

  describe('#getGenesOfPart()', function() {
    it('should return 3 matching genes', function() {
      let node = new GeneByTerm('GO:0005515');
      let res = qh.processNode(node);
      expect(res).to.have.members(genesOfGo0005515);
    });
  });

  describe('#geneQuery()', function() {
    it('should return 3 matching genes', function() {
      let query = new GeneQuery({
        "type": "term",
        "termid": "GO:0005515",
      });
      let res = qh.geneQuery(query);
      expect(res.header.names).to.have.members(['Gene systematic ID', 'Gene name']);
      expect(res.rows.length).to.equal(3);
      expect(res.rows.map((row: string[]) => row[0])).to.have.members(genesOfGo0005515);
    });

    it('should return 1 match from boolean query', function() {
      let query = new GeneQuery({
        "type": "bool",
        "operator": "and",
        "parts": [
          {
            "type": "term",
            "termid": "GO:0005515"
          },
          {
            "type": "term",
            "termid": "FYPO:0002060"
          }
        ],
      });
      let res = qh.geneQuery(query);
      expect(res.header.names).to.have.members(['Gene systematic ID', 'Gene name']);
      expect(res.rows.length).to.equal(1);
      expect(res.rows.map((row: string[]) => row[0]))
        .to.have.members(['SPCC1739.11c']);
    });
  });
});
