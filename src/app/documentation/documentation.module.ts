import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocsComponent } from './docs/docs.component';

import { Ng2SimplePageScrollModule } from '../ng2-simple-page-scroll/ng2-simple-page-scroll.module';

import { SharedModule } from '../shared/shared.module';

import { routing } from './documentation.routing';

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    Ng2SimplePageScrollModule,
    routing,
  ],
  declarations: [
    DocsComponent,
  ]
})
export class DocumentationModule { }
