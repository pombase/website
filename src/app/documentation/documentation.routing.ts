import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DocsComponent } from './docs/docs.component';

const routes: Routes = [
  { path: '',
    children: [ { path: '**', component: DocsComponent } ]
  },
];

export const routing: ModuleWithProviders<RouterModule> = RouterModule.forChild(routes);
