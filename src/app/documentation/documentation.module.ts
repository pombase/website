import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocsComponent } from './docs/docs.component';

import { NgxPageScrollModule } from 'ngx-page-scroll';

import { SharedModule } from '../shared/shared.module';

import { routing } from './documentation.routing';

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    NgxPageScrollModule,
    routing,
  ],
  declarations: [
    DocsComponent,
  ]
})
export class DocumentationModule { }
