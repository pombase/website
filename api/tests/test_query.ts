import 'mocha';

var expect = require('chai').expect;

import { QueryHandler } from '../query';
import { TermShort, GeneByTerm, QueryPartOperator } from '../common/pombase-query';

var assert = require('assert');

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
    it('should return no matches', function() {
      let part = new GeneByTerm('GO:0005515', QueryPartOperator.And);
      let res = qh.getGenesOfPart(part);
      expect(res).to.have.members(genesOfGo0005515);
    });
  });
});
