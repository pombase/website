import { TestBed } from '@angular/core/testing';

import { HttpRetryService } from './http-retry.service';

describe('HttpRetryService', () => {
  let service: HttpRetryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpRetryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
