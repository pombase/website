import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { TabsModule } from 'ngx-bootstrap/tabs';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { SlimTableComponent } from './slim-table/slim-table.component';
import { ContactEmailComponent } from './contact-email/contact-email.component';
import { CharacterisationStatusTableComponent } from './characterisation-status-table/characterisation-status-table.component';
import { QueryLinkComponent } from './query-link/query-link.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { ApiErrorDisplayComponent } from './api-error-display/api-error-display.component';
import { ExternalLinkComponent } from './external-link/external-link.component';
import { GeneResultsComponent } from './gene-results/gene-results.component';
import { GeneResultsVisComponent } from './gene-results-vis/gene-results-vis.component';
import { GenesTableComponent } from './genes-table/genes-table.component';
import { QueryDescriptionDisplayComponent } from './query-description-display/query-description-display.component';
import { GeneLinkComponent } from './gene-link/gene-link.component';
import { PageContentsMenuComponent } from './page-contents-menu/page-contents-menu.component';
import { CvVersionComponent } from './cv-version/cv-version.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { DetailsPageMenuComponent } from './details-page-menu/details-page-menu.component';
import { SeqFeatureTableComponent } from './seq-feature-table/seq-feature-table.component';
import { NgxPageScrollCoreModule } from 'ngx-page-scroll-core';
import { NgxPageScrollModule } from 'ngx-page-scroll';

import { PredefinedQueryResultsComponent } from './predefined-query-results/predefined-query-results.component';
import { SocialContactComponent } from './social-contact/social-contact.component';
import { GeneResultsSlimTableComponent } from './gene-results-slim-table/gene-results-slim-table.component';
import { FacetedSearchComponent } from './faceted-search/faceted-search.component';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NgxPageScrollCoreModule.forRoot({duration: 0}),
    NgxPageScrollModule,
    TabsModule.forRoot(),
    PopoverModule.forRoot(),
    BsDropdownModule.forRoot(),
    FontAwesomeModule,
  ],
  exports: [
    SlimTableComponent,
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
    GeneLinkComponent,
    PageContentsMenuComponent,
    CvVersionComponent,
    NotFoundComponent,
    DetailsPageMenuComponent,
    SeqFeatureTableComponent,
    SocialContactComponent,
    GeneResultsSlimTableComponent,
    FacetedSearchComponent,
  ],
  declarations: [
    SlimTableComponent,
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
    GeneLinkComponent,
    PageContentsMenuComponent,
    CvVersionComponent,
    NotFoundComponent,
    DetailsPageMenuComponent,
    SeqFeatureTableComponent,
    SocialContactComponent,
    GeneResultsSlimTableComponent,
    QueryDescriptionDisplayComponent,
    FacetedSearchComponent,
  ],
})
export class SharedModule { }
