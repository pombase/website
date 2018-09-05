import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { TabsModule } from 'ngx-bootstrap/tabs';
import { PopoverModule } from 'ngx-bootstrap';

import { GoSlimTableComponent } from './go-slim-table/go-slim-table.component';
import { ContactEmailComponent } from './contact-email/contact-email.component';
import { CharacterisationStatusTableComponent } from './characterisation-status-table/characterisation-status-table.component';
import { QueryLinkComponent } from './query-link/query-link.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { ApiErrorDisplayComponent } from './api-error-display/api-error-display.component';
import { ExternalLinkComponent } from './external-link/external-link.component';
import { GeneResultsComponent } from './gene-results/gene-results.component';
import { GeneResultsVisComponent } from './gene-results-vis/gene-results-vis.component';
import { GenesTableComponent } from './genes-table/genes-table.component';
import { GeneShortOrderByPipe } from './gene-short-order-by.pipe';
import { GeneLinkComponent } from './gene-link/gene-link.component';
import { PageContentsMenuComponent } from './page-contents-menu/page-contents-menu.component';
import { CvVersionComponent } from './cv-version/cv-version.component';
import { DetailsPageMenuComponent } from './details-page-menu/details-page-menu.component';
import { Ng2SimplePageScrollModule } from '../ng2-simple-page-scroll/ng2-simple-page-scroll.module';

import { PredefinedQueryResultsComponent } from './predefined-query-results/predefined-query-results.component';
import { SocialContactComponent } from './social-contact/social-contact.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    Ng2SimplePageScrollModule.forRoot(),
    TabsModule.forRoot(),
    PopoverModule.forRoot(),
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
    GeneResultsVisComponent,
    GenesTableComponent,
    GeneShortOrderByPipe,
    GeneLinkComponent,
    PageContentsMenuComponent,
    CvVersionComponent,
    DetailsPageMenuComponent,
    SocialContactComponent,
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
    GeneResultsVisComponent,
    GenesTableComponent,
    GeneShortOrderByPipe,
    GeneLinkComponent,
    PageContentsMenuComponent,
    CvVersionComponent,
    DetailsPageMenuComponent,
    SocialContactComponent,
  ],
})
export class SharedModule { }
