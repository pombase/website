import { QueryHandler } from '../query';
var assert = require('assert');

describe('QueryHandler', function() {
  describe('#getGenesOfPart()', function() {
    it('should return no matches', function() {
      var qh = new QueryHandler('./test/data/');
      assert.equal([], []);
    });
  });
});
