import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';

import { TypeaheadModule } from 'ng2-bootstrap/ng2-bootstrap';

import { AppComponent } from './app.component';
import { GeneDetailsComponent } from './gene-details/gene-details.component';
import { TermDetailsComponent } from './term-details/term-details.component';
import { FrontComponent } from './front/front.component';
import { PombaseAPIService } from './pombase-api.service';
import { GeneAnnotationTableComponent } from './gene-annotation-table/gene-annotation-table.component';
import { TermAnnotationTableComponent } from './term-annotation-table/term-annotation-table.component';
import { SearchBoxComponent } from './search-box/search-box.component';
import { GetFocusDirective } from './get-focus.directive';
import { InteractionAnnotationTableComponent } from './interaction-annotation-table/interaction-annotation-table.component';
import { OrthologAnnotationTableComponent } from './ortholog-annotation-table/ortholog-annotation-table.component';
import { ParalogAnnotationTableComponent } from './paralog-annotation-table/paralog-annotation-table.component';
import { ReferenceShortComponent } from './reference-short/reference-short.component';

@NgModule({
  declarations: [
    AppComponent,
    GeneDetailsComponent,
    FrontComponent,
    TermDetailsComponent,
    GeneAnnotationTableComponent,
    TermAnnotationTableComponent,
    SearchBoxComponent,
    GetFocusDirective,
    InteractionAnnotationTableComponent,
    OrthologAnnotationTableComponent,
    ParalogAnnotationTableComponent,
    ReferenceShortComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    TypeaheadModule,
  ],
  providers: [PombaseAPIService],
  bootstrap: [AppComponent]
})
export class AppModule { }
