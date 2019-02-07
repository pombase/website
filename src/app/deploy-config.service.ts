import { Injectable, Inject } from '@angular/core';

interface DeployConfig {
  mode: string;
}

@Injectable()
export class DeployConfigService {
  config: DeployConfig = { mode: 'dev' };

  constructor(@Inject('Window') private window: any) {
    if (window.pombaseAppDeployConfig &&
        typeof(window.pombaseAppDeployConfig) === 'object') {
      this.config = window.pombaseAppDeployConfig;
    }
  }

  getMode(): string {
    return this.config.mode;
  }

  productionMode(): boolean {
    return this.config.mode !== 'dev';
  }
}
