import { TestBed, inject } from '@angular/core/testing';

import { DeployConfigService } from './deploy-config.service';

describe('DeployConfigService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DeployConfigService]
    });
  });

  it('should be created', inject([DeployConfigService], (service: DeployConfigService) => {
    expect(service).toBeTruthy();
  }));
});
