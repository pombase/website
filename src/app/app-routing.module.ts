import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GeneDetailsComponent } from './gene-details/gene-details.component';
import { TermDetailsComponent } from './term-details/term-details.component';
import { TermGenesViewComponent } from './term-genes-view/term-genes-view.component';
import { ReferenceDetailsComponent } from './reference-details/reference-details.component';
import { FrontComponent } from './front/front.component';

const routes: Routes = [
  { path: 'gene/:uniquename', component: GeneDetailsComponent,
    data: {
      title: 'Gene'
    }
  },
  { path: 'spombe/result/:uniquename', component: GeneDetailsComponent,
    data: {
      title: 'Gene'
    }
  },
  { path: 'term/:termid', component: TermDetailsComponent,
    data: {
      title: 'Term'
    }
  },
  { path: 'term_genes/:termid', component: TermGenesViewComponent,
    data: {
      title: 'Term'
    }
  },
  { path: 'reference/:uniquename', component: ReferenceDetailsComponent,
    data: {
      title: 'Reference'
    }
  },
    { path: 'front', redirectTo: '/', pathMatch: 'full' },
    { path: '', component: FrontComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
