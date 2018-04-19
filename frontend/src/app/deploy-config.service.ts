import { Injectable, Inject } from '@angular/core';

@Injectable()
export class DeployConfigService {
  config = { mode: 'dev' };

  constructor(@Inject('Window') private window: any) {
    if (window.pombaseAppDeployConfig &&
        typeof(window.pombaseAppDeployConfig) === 'object') {
      this.config = window.pombaseAppDeployConfig;
    }
  }

  get(key: string): any {
    return this.config[key];
  }
}
