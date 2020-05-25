import { TestBed } from '@angular/core/testing';

import { SolrSearchService } from './solr-search.service';

describe('SolrSearchService', () => {
  let service: SolrSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SolrSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
