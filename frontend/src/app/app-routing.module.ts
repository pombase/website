import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Angulartics2Module, Angulartics2GoogleAnalytics } from 'angulartics2';

import { GeneDetailsComponent } from './gene-details/gene-details.component';
import { GenotypeDetailsComponent } from './genotype-details/genotype-details.component';
import { TermDetailsComponent } from './term-details/term-details.component';
import { TermGenesViewComponent } from './term-genes-view/term-genes-view.component';
import { TermGenotypesViewComponent } from './term-genotypes-view/term-genotypes-view.component';
import { TermSingleGeneGenotypesViewComponent } from './term-single-gene-genotypes-view/term-single-gene-genotypes-view.component';
import { ReferenceDetailsComponent } from './reference-details/reference-details.component';
import { QueryBuilderComponent } from './query-builder/query-builder.component';
import { FrontComponent } from './front/front.component';

const routes: Routes = [
  { path: 'gene/:uniquename', component: GeneDetailsComponent,
    data: {
      title: 'Gene'
    }
  },
  { path: 'genotype/:uniquename', component: GenotypeDetailsComponent,
    data: {
      title: 'Genotype'
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
      title: 'Term genes'
    }
  },
  { path: 'term_genotypes/:termid', component: TermGenotypesViewComponent,
    data: {
      title: 'Term genotypes'
    }
  },
  { path: 'term_single_allele_genotype_genes/:termid', component: TermSingleGeneGenotypesViewComponent,
    data: {
      title: 'Genes from single-allele genotypes'
    }
  },
  { path: 'reference/:uniquename', component: ReferenceDetailsComponent,
    data: {
      title: 'Reference'
    }
  },
  { path: 'query_builder', component: QueryBuilderComponent,
    data: {
      title: 'Query builder'
    }
  },
    { path: 'front', redirectTo: '/', pathMatch: 'full' },
    { path: '', component: FrontComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes),
            Angulartics2Module.forRoot([ Angulartics2GoogleAnalytics ])],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
