import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { GoSlimTableComponent } from './go-slim-table/go-slim-table.component';
import { ContactEmailComponent } from './contact-email/contact-email.component';
import { CharacterisationStatusTableComponent } from './characterisation-status-table/characterisation-status-table.component';
import { QueryLinkComponent } from './query-link/query-link.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { ApiErrorDisplayComponent } from './api-error-display/api-error-display.component';
import { ExternalLinkComponent } from './external-link/external-link.component';
import { GeneResultsComponent } from './gene-results/gene-results.component';
import { GenesTableComponent } from './genes-table/genes-table.component';
import { GeneShortOrderByPipe } from './gene-short-order-by.pipe';
import { GeneLinkComponent } from './gene-link/gene-link.component';
import { CvVersionComponent } from './cv-version/cv-version.component';

import { PredefinedQueryResultsComponent } from './predefined-query-results/predefined-query-results.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
  ],
  exports: [
    GoSlimTableComponent,
    ContactEmailComponent,
    CharacterisationStatusTableComponent,
    QueryLinkComponent,
    PredefinedQueryResultsComponent,
    LoadingSpinnerComponent,
    ApiErrorDisplayComponent,
    ExternalLinkComponent,
    GeneResultsComponent,
    GenesTableComponent,
    GeneShortOrderByPipe,
    GeneLinkComponent,
    CvVersionComponent,
  ],
  declarations: [
    GoSlimTableComponent,
    ContactEmailComponent,
    CharacterisationStatusTableComponent,
    QueryLinkComponent,
    PredefinedQueryResultsComponent,
    LoadingSpinnerComponent,
    ApiErrorDisplayComponent,
    ExternalLinkComponent,
    GeneResultsComponent,
    GenesTableComponent,
    GeneShortOrderByPipe,
    GeneLinkComponent,
    CvVersionComponent,
  ],
})
export class SharedModule { }
