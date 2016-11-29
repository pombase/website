import 'mocha';

import { QueryHandler } from '../query';

var assert = require('assert');

describe('QueryHandler', function() {
  describe('#getGenesOfPart()', function() {
    it('should return no matches', function() {
      var qh = new QueryHandler('./tests/data');
      assert.equal([], []);
    });
  });
});
