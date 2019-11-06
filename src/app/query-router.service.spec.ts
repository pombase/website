import { TestBed } from '@angular/core/testing';

import { QueryRouterService } from './query-router.service';

describe('QueryRouterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: QueryRouterService = TestBed.get(QueryRouterService);
    expect(service).toBeTruthy();
  });
});
