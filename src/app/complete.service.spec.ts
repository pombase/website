import { TestBed, inject } from '@angular/core/testing';

import { CompleteService } from './complete.service';

describe('CompleteService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CompleteService]
    });
  });

  it('should be created', inject([CompleteService], (service: CompleteService) => {
    expect(service).toBeTruthy();
  }));
});
