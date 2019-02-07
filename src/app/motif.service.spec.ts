import { TestBed } from '@angular/core/testing';

import { MotifService } from './motif.service';

describe('MotifService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MotifService = TestBed.get(MotifService);
    expect(service).toBeTruthy();
  });
});
