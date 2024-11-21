import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Injectable, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';

import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';

import { ToastrModule } from 'ngx-toastr';

import { NgxPageScrollCoreModule } from 'ngx-page-scroll-core';
import { NgxPageScrollModule } from 'ngx-page-scroll';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { SharedModule } from './shared/shared.module';

import { AppComponent } from './app.component';
import { GeneDetailsComponent } from './gene-details/gene-details.component';
import { TermDetailsComponent } from './term-details/term-details.component';
import { FrontComponent } from './front/front.component';
import { PombaseAPIService } from './pombase-api.service';
import { QueryService } from './query.service';
import { CompleteService } from './complete.service';
import { DeployConfigService } from './deploy-config.service';
import { AnnotationTableComponent } from './annotation-table/annotation-table.component';
import { SearchBoxComponent } from './search-box/search-box.component';
import { InteractionAnnotationTableComponent } from './interaction-annotation-table/interaction-annotation-table.component';
import { OrthologAnnotationTableComponent } from './ortholog-annotation-table/ortholog-annotation-table.component';
import { ParalogAnnotationTableComponent } from './paralog-annotation-table/paralog-annotation-table.component';
import { ReferenceShortComponent } from './reference-short/reference-short.component';
import { ReferenceDetailsComponent } from './reference-details/reference-details.component';
import { ExtensionDisplayComponent } from './extension-display/extension-display.component';
import { GenotypeLinkComponent } from './genotype-link/genotype-link.component';
import { TermGenesViewComponent } from './term-genes-view/term-genes-view.component';
import { TermNameCompleteComponent } from './term-name-complete/term-name-complete.component';
import { QueryBuilderComponent } from './query-builder/query-builder.component';
import { QueryNodeComponent } from './query-node/query-node.component';
import { GeneNeighbourhoodComponent } from './gene-neighbourhood/gene-neighbourhood.component';
import { AnnotationSubTableComponent } from './annotation-sub-table/annotation-sub-table.component';
import { TargetOfAnnotationTableComponent } from './target-of-annotation-table/target-of-annotation-table.component';
import { GeneReferencesTableComponent } from './gene-references-table/gene-references-table.component';
import { ReferenceOrderByPipe } from './reference-order-by.pipe';
import { EvidenceLinkComponent } from './evidence-link/evidence-link.component';
import { QuantGeneExTableComponent } from './quant-gene-ex-table/quant-gene-ex-table.component';
import { WithOrFromLinkComponent } from './with-or-from-link/with-or-from-link.component';
import { GenotypeDetailsComponent } from './genotype-details/genotype-details.component';
import { TermGenotypesViewComponent } from './term-genotypes-view/term-genotypes-view.component';
import { GenotypesTableComponent } from './genotypes-table/genotypes-table.component';
import { TermSingleGeneGenotypesViewComponent } from './term-single-gene-genotypes-view/term-single-gene-genotypes-view.component';
import { GenotypeOrderByPipe } from './genotype-order-by.pipe';
import { AnnotationTableFiltersComponent } from './annotation-table-filters/annotation-table-filters.component';
import { AnnotationTableTermFilterComponent } from './annotation-table-term-filter/annotation-table-term-filter.component';
import { AnnotationTablePloidinessFilterComponent } from './annotation-table-ploidiness-filter/annotation-table-ploidiness-filter.component';
import { AnnotationTableFilterPipe } from './annotation-table-filter.pipe';
import { GeneExternalReferencesComponent } from './gene-external-references/gene-external-references.component';
import { AnnotationTableEvidenceFilterComponent } from './annotation-table-evidence-filter/annotation-table-evidence-filter.component';
import { GenotypeAlleleSummaryComponent } from './genotype-allele-summary/genotype-allele-summary.component';
import { DeletionViabilitySummaryComponent } from './deletion-viability-summary/deletion-viability-summary.component';
import { SlimSummaryComponent } from './slim-summary/slim-summary.component';
import { ReferenceShortListComponent } from './reference-short-list/reference-short-list.component';
import { TranscriptSequenceSelectComponent } from './transcript-sequence-select/transcript-sequence-select.component';
import { ProteinPropertiesComponent } from './protein-properties/protein-properties.component';
import { ProteinFeaturesComponent } from './protein-features/protein-features.component';
import { GeneSubsetViewComponent } from './gene-subset-view/gene-subset-view.component';
import { TranscriptViewComponent } from './transcript-view/transcript-view.component';
import { InterproMatchesComponent } from './interpro-matches/interpro-matches.component';
import { QueryHistoryComponent } from './query-history/query-history.component';
import { GeneListLookupComponent } from './gene-list-lookup/gene-list-lookup.component';
import { TermExternalLinksComponent } from './term-external-links/term-external-links.component';
import { TermPageSummaryComponent } from './term-page-summary/term-page-summary.component';
import { MainNavBarComponent } from './main-nav-bar/main-nav-bar.component';
import { QueryTermNodeComponent } from './query-term-node/query-term-node.component';
import { GenesDownloadDialogComponent } from './genes-download-dialog/genes-download-dialog.component';
import { MiscAnnotationTableComponent } from './misc-annotation-table/misc-annotation-table.component';
import { QueryDetailsDialogComponent } from './query-details-dialog/query-details-dialog.component';
import { RecentNewsComponent } from './recent-news/recent-news.component';
import { FrontPanelContentComponent } from './front-panel-content/front-panel-content.component';
import { FrontPanelComponent } from './front-panel/front-panel.component';
import { RecentCommunityPubsComponent } from './recent-community-pubs/recent-community-pubs.component';
import { PanelArchiveComponent } from './panel-archive/panel-archive.component';
import { MessageDialogComponent } from './message-dialog/message-dialog.component';
import { ReferenceDetailListComponent } from './reference-detail-list/reference-detail-list.component';
import { ReferenceDetailListPageComponent } from './reference-detail-list-page/reference-detail-list-page.component';
import { GeneResultsPageComponent } from './gene-results-page/gene-results-page.component';

import { Angulartics2Module } from 'angulartics2';
import { Angulartics2GoogleAnalytics } from 'angulartics2';
import { AnnotationTableExtLinksComponent } from './annotation-table-ext-links/annotation-table-ext-links.component';
import { HelpLinkComponent } from './help-link/help-link.component';

import { AnnotationTableExtensionFilterComponent } from './annotation-table-extension-filter/annotation-table-extension-filter.component';
import { RouterNotFoundHandlerComponent } from './router-not-found-handler/router-not-found-handler.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { MotifSearchComponent } from './motif-search/motif-search.component';
import { InteractionTableFiltersComponent } from './interaction-table-filters/interaction-table-filters.component';
import { GeneticInteractionTableFiltersComponent } from './genetic-interaction-table-filters/genetic-interaction-table-filters.component';
import { InteractionTableThroughputFilterComponent }
   from './interaction-table-throughput-filter/interaction-table-throughput-filter.component';
import { GeneticInteractionTableThroughputFilterComponent }
   from './genetic-interaction-table-throughput-filter/genetic-interaction-table-throughput-filter.component';
import { GenesTableConfigComponent } from './genes-table-config/genes-table-config.component';
import { ExternalRefsTableComponent } from './external-refs-table/external-refs-table.component';
import { AnnotationTableThroughputFilterComponent }
   from './annotation-table-throughput-filter/annotation-table-throughput-filter.component';
import { MotifSearchHelpComponent } from './motif-search-help/motif-search-help.component';
import { JbrowseTrackPickerComponent } from './jbrowse-track-picker/jbrowse-track-picker.component';
import { StatsRibbonComponent } from './stats-ribbon/stats-ribbon.component';
import { AllCvVersionsComponent } from './all-cv-versions/all-cv-versions.component';
import { InternalDetailsComponent } from './internal-details/internal-details.component';
import { IdentifierMapperComponent } from './identifier-mapper/identifier-mapper.component';
import { TermLinkComponent } from './term-link/term-link.component';
import { IdentifierMapperResultsComponent } from './identifier-mapper-results/identifier-mapper-results.component';
import { JbrowseTrackOrderByPipe } from './jbrowse-track-order-by.pipe';
import { NotDirectionSelectDialogComponent } from './not-direction-select-dialog/not-direction-select-dialog.component';
import { QuerySubsetInputComponent } from './query-subset-input/query-subset-input.component';
import { QuerySubNodesComponent } from './query-sub-nodes/query-sub-nodes.component';
import { QueryNodeDisplayComponent } from './query-node-display/query-node-display.component';
import { GeneQueryStructureComponent } from './gene-query-structure/gene-query-structure.component';
import { GeneVisSettingsComponent } from './gene-vis-settings/gene-vis-settings.component';
import { QueryRangeNodeComponent } from './query-range-node/query-range-node.component';
import { QueryGenomeRangeNodeComponent } from './query-genome-range-node/query-genome-range-node.component';
import { GeneAlleleListComponent } from './gene-allele-list/gene-allele-list.component';
import { AlleleDetailsComponent } from './allele-details/allele-details.component';
import { GeneticInteractionAnnotationTableComponent } from './genetic-interaction-annotation-table/genetic-interaction-annotation-table.component';
import { GenePageWidgetsComponent } from './gene-page-widgets/gene-page-widgets.component';
import { GenotypeReferencesTableComponent } from './genotype-references-table/genotype-references-table.component';
import { GeneHistoryTableComponent } from './gene-history-table/gene-history-table.component';
import { AlphafoldViewerComponent } from './alphafold-viewer/alphafold-viewer.component';
import { PdbStructureViewerComponent } from './pdb-structure-viewer/pdb-structure-viewer.component';
import { TermPageWidgetsComponent } from './term-page-widgets/term-page-widgets.component';
import { ReactionViewComponent } from './reaction-view/reaction-view.component';
import { ProteinFeatureViewerComponent } from './protein-feature-viewer/protein-feature-viewer.component';
import { GeneProteinFeaturesComponent } from './gene-protein-features/gene-protein-features.component';

export function documentFactory() {
    return document;
}
export function windowFactory() {
    return window;
}

import { Pipe, PipeTransform } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { RefGenesViewComponent } from './ref-genes-view/ref-genes-view.component';
import { CurationStatsComponent } from './curation-stats/curation-stats.component';
import { AnnotationTableWidgetsComponent } from './annotation-table-widgets/annotation-table-widgets.component';
import { StatsSummaryComponent } from './stats-summary/stats-summary.component';
import { AllelePromoterListComponent } from './allele-promoter-list/allele-promoter-list.component';
import { DefaultUrlSerializer, UrlSerializer, UrlTree } from '@angular/router';
import { GoCamViewerComponent } from './go-cam-viewer/go-cam-viewer.component';
import { GoCamViewPageComponent } from './go-cam-view-page/go-cam-view-page.component';
import { GeneticInteractionTableTypeFilterComponent } from './genetic-interaction-table-type-filter/genetic-interaction-table-type-filter.component';
import { RnaStructureComponent } from './rna-structure/rna-structure.component';
import { ProteinFeatureTableComponent } from './protein-feature-table/protein-feature-table.component';

@Pipe({
    name: 'safeUrl',
    standalone: false
})
export class SafeUrlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) { }
  transform(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}


/**
 * A workaround for this issue: https://github.com/angular/angular/issues/50787
 * From: https://github.com/angular/angular/issues/50787#issuecomment-1771251427
 */
@Injectable({ providedIn: 'root' })
export class PomBaseUrlSerializer extends DefaultUrlSerializer {
  parse(url: string): UrlTree {
    return super.parse(this.removeParentheses(url));
  }

  private removeParentheses(url: string): string {
    const regex = /(\(|\))/g;
    const encodedString = url.replace(regex, (match) => {
      if (match === '(') {
        return '%28'; // URL-encoded version of "("
      } else {
        return '%29'; // URL-encoded version of ")"
      }
    });
    return encodedString;
  }
}

@NgModule({ declarations: [
        AppComponent,
        SafeUrlPipe,
        GeneDetailsComponent,
        FrontComponent,
        TermDetailsComponent,
        AnnotationTableComponent,
        SearchBoxComponent,
        InteractionAnnotationTableComponent,
        OrthologAnnotationTableComponent,
        ParalogAnnotationTableComponent,
        ReferenceShortComponent,
        ReferenceDetailsComponent,
        ExtensionDisplayComponent,
        GenotypeLinkComponent,
        TermGenesViewComponent,
        TermNameCompleteComponent,
        QueryBuilderComponent,
        QueryNodeComponent,
        GeneNeighbourhoodComponent,
        AnnotationSubTableComponent,
        TargetOfAnnotationTableComponent,
        GeneReferencesTableComponent,
        ReferenceOrderByPipe,
        EvidenceLinkComponent,
        QuantGeneExTableComponent,
        WithOrFromLinkComponent,
        GenotypeDetailsComponent,
        TermGenotypesViewComponent,
        GenotypesTableComponent,
        TermSingleGeneGenotypesViewComponent,
        GenotypeOrderByPipe,
        AnnotationTableFiltersComponent,
        AnnotationTableTermFilterComponent,
        AnnotationTablePloidinessFilterComponent,
        AnnotationTableFilterPipe,
        GeneExternalReferencesComponent,
        AnnotationTableEvidenceFilterComponent,
        GenotypeAlleleSummaryComponent,
        DeletionViabilitySummaryComponent,
        SlimSummaryComponent,
        ReferenceShortListComponent,
        TranscriptSequenceSelectComponent,
        ProteinPropertiesComponent,
        ProteinFeaturesComponent,
        GeneSubsetViewComponent,
        TranscriptViewComponent,
        InterproMatchesComponent,
        QueryHistoryComponent,
        GeneListLookupComponent,
        TermExternalLinksComponent,
        TermPageSummaryComponent,
        MainNavBarComponent,
        QueryTermNodeComponent,
        GenesDownloadDialogComponent,
        MiscAnnotationTableComponent,
        QueryDetailsDialogComponent,
        RecentNewsComponent,
        FrontPanelContentComponent,
        FrontPanelComponent,
        RecentCommunityPubsComponent,
        PanelArchiveComponent,
        MessageDialogComponent,
        ReferenceDetailListComponent,
        ReferenceDetailListPageComponent,
        AnnotationTableExtLinksComponent,
        HelpLinkComponent,
        AnnotationTableExtensionFilterComponent,
        RouterNotFoundHandlerComponent,
        StatisticsComponent,
        MotifSearchComponent,
        InteractionTableFiltersComponent,
        InteractionTableThroughputFilterComponent,
        GeneticInteractionTableThroughputFilterComponent,
        GenesTableConfigComponent,
        ExternalRefsTableComponent,
        AnnotationTableThroughputFilterComponent,
        MotifSearchHelpComponent,
        JbrowseTrackPickerComponent,
        GeneResultsPageComponent,
        StatsRibbonComponent,
        AllCvVersionsComponent,
        InternalDetailsComponent,
        IdentifierMapperComponent,
        TermLinkComponent,
        IdentifierMapperResultsComponent,
        JbrowseTrackOrderByPipe,
        NotDirectionSelectDialogComponent,
        QuerySubsetInputComponent,
        QuerySubNodesComponent,
        QueryNodeDisplayComponent,
        GeneQueryStructureComponent,
        GeneVisSettingsComponent,
        QueryRangeNodeComponent,
        QueryGenomeRangeNodeComponent,
        GeneAlleleListComponent,
        AlleleDetailsComponent,
        GeneticInteractionAnnotationTableComponent,
        GeneticInteractionTableFiltersComponent,
        GenePageWidgetsComponent,
        GenotypeReferencesTableComponent,
        GeneHistoryTableComponent,
        AlphafoldViewerComponent,
        PdbStructureViewerComponent,
        TermPageWidgetsComponent,
        ReactionViewComponent,
        ProteinFeatureViewerComponent,
        GeneProteinFeaturesComponent,
        RefGenesViewComponent,
        CurationStatsComponent,
        AnnotationTableWidgetsComponent,
        StatsSummaryComponent,
        AllelePromoterListComponent,
        GoCamViewerComponent,
        GoCamViewPageComponent,
        GeneticInteractionTableTypeFilterComponent,
        RnaStructureComponent,
        ProteinFeatureTableComponent,
    ],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA], imports: [BrowserModule,
        CommonModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        AppRoutingModule,
        TypeaheadModule.forRoot(),
        PaginationModule.forRoot(),
        ButtonsModule.forRoot(),
        BsDropdownModule.forRoot(),
        TabsModule.forRoot(),
        PopoverModule.forRoot(),
        ModalModule.forRoot(),
        ToastrModule.forRoot({
            timeOut: 7500,
            extendedTimeOut: 5000,
            enableHtml: true,
            positionClass: 'toast-top-center',
        }),
        NgxPageScrollCoreModule.forRoot({ duration: 0 }),
        NgxPageScrollModule,
        SharedModule,
        Angulartics2Module.forRoot(),
        FontAwesomeModule], providers: [PombaseAPIService,
        { provide: 'Window', useValue: window },
        { provide: 'Document', useFactory: documentFactory },
        { provide: 'Window', useFactory: windowFactory },
        {
            provide: UrlSerializer,
            useClass: PomBaseUrlSerializer,
        },
        QueryService,
        CompleteService,
        DeployConfigService, provideHttpClient(withInterceptorsFromDi()),] })
export class AppModule {
  constructor(angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics) {
    angulartics2GoogleAnalytics.startTracking();
  }

}
