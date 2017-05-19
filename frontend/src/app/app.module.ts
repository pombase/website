import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';

import { TypeaheadModule, PaginationModule, PopoverModule } from 'ng2-bootstrap';
import { MarkdownModule } from 'angular2-markdown';

import { AppComponent } from './app.component';
import { GeneDetailsComponent } from './gene-details/gene-details.component';
import { TermDetailsComponent } from './term-details/term-details.component';
import { FrontComponent } from './front/front.component';
import { PombaseAPIService } from './pombase-api.service';
import { AnnotationTableComponent } from './annotation-table/annotation-table.component';
import { SearchBoxComponent } from './search-box/search-box.component';
import { GetFocusDirective } from './get-focus.directive';
import { InteractionAnnotationTableComponent } from './interaction-annotation-table/interaction-annotation-table.component';
import { OrthologAnnotationTableComponent } from './ortholog-annotation-table/ortholog-annotation-table.component';
import { ParalogAnnotationTableComponent } from './paralog-annotation-table/paralog-annotation-table.component';
import { ReferenceShortComponent } from './reference-short/reference-short.component';
import { ReferenceDetailsComponent } from './reference-details/reference-details.component';
import { GeneLinkComponent } from './gene-link/gene-link.component';
import { ExtensionDisplayComponent } from './extension-display/extension-display.component';
import { GenotypeLinkComponent } from './genotype-link/genotype-link.component';
import { TermGenesViewComponent } from './term-genes-view/term-genes-view.component';
import { GenesTableComponent } from './genes-table/genes-table.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { TermNameCompleteComponent } from './term-name-complete/term-name-complete.component';
import { QueryBuilderComponent } from './query-builder/query-builder.component';
import { QueryNodeComponent } from './query-node/query-node.component';
import { GeneResultsComponent } from './gene-results/gene-results.component';
import { GeneNeighbourhoodComponent } from './gene-neighbourhood/gene-neighbourhood.component';
import { AnnotationSubTableComponent } from './annotation-sub-table/annotation-sub-table.component';
import { TargetOfAnnotationTableComponent } from './target-of-annotation-table/target-of-annotation-table.component';
import { GeneReferencesTableComponent } from './gene-references-table/gene-references-table.component';
import { ReferenceOrderByPipe } from './reference-order-by.pipe';
import { GeneShortOrderByPipe } from './gene-short-order-by.pipe';
import { EvidenceLinkComponent } from './evidence-link/evidence-link.component';
import { QuantGeneExTableComponent } from './quant-gene-ex-table/quant-gene-ex-table.component';
import { QualGeneExTableComponent } from './qual-gene-ex-table/qual-gene-ex-table.component';
import { WithOrFromLinkComponent } from './with-or-from-link/with-or-from-link.component';
import { GenotypeDetailsComponent } from './genotype-details/genotype-details.component';
import { Ng2SimplePageScrollModule } from './ng2-simple-page-scroll/ng2-simple-page-scroll.module';
import { SimplePageScrollConfig } from './ng2-simple-page-scroll/ng2-simple-page-scroll-config';
import { GenePageMenuComponent } from './gene-page-menu/gene-page-menu.component';
import { TermGenotypesViewComponent } from './term-genotypes-view/term-genotypes-view.component';
import { GenotypesTableComponent } from './genotypes-table/genotypes-table.component';
import { TermSingleGeneGenotypesViewComponent } from './term-single-gene-genotypes-view/term-single-gene-genotypes-view.component';
import { GenotypeOrderByPipe } from './genotype-order-by.pipe';
import { AnnotationTableFiltersComponent } from './annotation-table-filters/annotation-table-filters.component';
import { AnnotationTableTermFilterComponent } from './annotation-table-term-filter/annotation-table-term-filter.component';
import { AnnotationTableFilterPipe } from './annotation-table-filter.pipe';
import { GeneExternalReferencesComponent } from './gene-external-references/gene-external-references.component';
import { DocsComponent } from './docs/docs.component';
import { AnnotationTableEvidenceFilterComponent } from './annotation-table-evidence-filter/annotation-table-evidence-filter.component';
import { GenotypeAlleleSummaryComponent } from './genotype-allele-summary/genotype-allele-summary.component';
import { DeletionViabilitySummaryComponent } from './deletion-viability-summary/deletion-viability-summary.component';
import { GoSlimSummaryComponent } from './go-slim-summary/go-slim-summary.component';
import { ExternalLinkComponent } from './external-link/external-link.component';
import { ApiErrorDisplayComponent } from './api-error-display/api-error-display.component';
import { ContactEmailComponent } from './contact-email/contact-email.component';
import { GoSlimTableComponent } from './go-slim-table/go-slim-table.component';
import { ReferenceShortListComponent } from './reference-short-list/reference-short-list.component';

export function documentFactory() {
    return document;
}
export function windowFactory() {
    return window;
}

@NgModule({
  declarations: [
    AppComponent,
    GeneDetailsComponent,
    FrontComponent,
    TermDetailsComponent,
    AnnotationTableComponent,
    SearchBoxComponent,
    GetFocusDirective,
    InteractionAnnotationTableComponent,
    OrthologAnnotationTableComponent,
    ParalogAnnotationTableComponent,
    ReferenceShortComponent,
    ReferenceDetailsComponent,
    GeneLinkComponent,
    ExtensionDisplayComponent,
    GenotypeLinkComponent,
    TermGenesViewComponent,
    GenesTableComponent,
    LoadingSpinnerComponent,
    TermNameCompleteComponent,
    QueryBuilderComponent,
    QueryNodeComponent,
    GeneResultsComponent,
    GeneNeighbourhoodComponent,
    AnnotationSubTableComponent,
    TargetOfAnnotationTableComponent,
    GeneReferencesTableComponent,
    ReferenceOrderByPipe,
    GeneShortOrderByPipe,
    EvidenceLinkComponent,
    QuantGeneExTableComponent,
    QualGeneExTableComponent,
    WithOrFromLinkComponent,
    GenotypeDetailsComponent,
    GenePageMenuComponent,
    TermGenotypesViewComponent,
    GenotypesTableComponent,
    TermSingleGeneGenotypesViewComponent,
    GenotypeOrderByPipe,
    AnnotationTableFiltersComponent,
    AnnotationTableTermFilterComponent,
    AnnotationTableFilterPipe,
    GeneExternalReferencesComponent,
    DocsComponent,
    AnnotationTableEvidenceFilterComponent,
    GenotypeAlleleSummaryComponent,
    DeletionViabilitySummaryComponent,
    GoSlimSummaryComponent,
    ExternalLinkComponent,
    ApiErrorDisplayComponent,
    ContactEmailComponent,
    GoSlimTableComponent,
    ReferenceShortListComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    TypeaheadModule.forRoot(),
    PaginationModule.forRoot(),
    PopoverModule.forRoot(),
    Ng2SimplePageScrollModule.forRoot(),
    MarkdownModule.forRoot(),
  ],
  providers: [PombaseAPIService,
              { provide: 'Window', useValue: window },
              { provide: 'Document', useFactory: documentFactory },
              { provide: 'Window', useFactory: windowFactory },
             ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
  }
}
