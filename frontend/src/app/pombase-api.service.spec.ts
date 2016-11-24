/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PombaseAPIService } from './pombase-api.service';

describe('Service: PombaseAPI', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PombaseAPIService]
    });
  });

  it('should ...', inject([PombaseAPIService], (service: PombaseAPIService) => {
    expect(service).toBeTruthy();
  }));
});
