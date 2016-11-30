import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';

import { TypeaheadModule } from 'ng2-bootstrap/ng2-bootstrap';
import { PaginationModule } from 'ng2-bootstrap/ng2-bootstrap';

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
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    TypeaheadModule,
    PaginationModule,
  ],
  providers: [PombaseAPIService],
  bootstrap: [AppComponent]
})
export class AppModule { }
