import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GeneDetailsComponent } from './gene-details/gene-details.component';
import { TermDetailsComponent } from './term-details/term-details.component';
import { FrontComponent } from './front/front.component';

const routes: Routes = [
    { path: 'gene/:uniquename', component: GeneDetailsComponent },
    { path: 'spombe/result/:uniquename', component: GeneDetailsComponent },
    { path: 'term/:termid', component: TermDetailsComponent },
    { path: 'front', redirectTo: '/', pathMatch: 'full' },
    { path: '', component: FrontComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
