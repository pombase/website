import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Angulartics2Module, Angulartics2GoogleAnalytics } from 'angulartics2';

import { GeneDetailsComponent } from './gene-details/gene-details.component';
import { GenotypeDetailsComponent } from './genotype-details/genotype-details.component';
import { TermDetailsComponent } from './term-details/term-details.component';
import { TermGenesViewComponent } from './term-genes-view/term-genes-view.component';
import { GeneSubsetViewComponent } from './gene-subset-view/gene-subset-view.component';
import { TermGenotypesViewComponent } from './term-genotypes-view/term-genotypes-view.component';
import { TermSingleGeneGenotypesViewComponent } from './term-single-gene-genotypes-view/term-single-gene-genotypes-view.component';
import { ReferenceDetailsComponent } from './reference-details/reference-details.component';
import { DocsComponent } from './docs/docs.component';
import { QueryBuilderComponent } from './query-builder/query-builder.component';
import { FrontComponent } from './front/front.component';

const routes: Routes = [
  { path: 'gene/:uniquename', component: GeneDetailsComponent,
    data: {
      title: 'Gene'
    }
  },
  { path: 'gene_subset/:subsetName', component: GeneSubsetViewComponent,
    data: {
      title: 'Gene subset'
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
  { path: 'community',
    data: {
      title: 'Community'
    },
    children: [ { path: '**', data: { docsParent: 'community' }, component: DocsComponent } ]
  },
  { path: 'about',
    data: {
      title: 'About'
    },
    children: [ { path: '**', data: { docsParent: 'about' }, component: DocsComponent } ]
  },
  { path: 'help',
    data: {
      title: 'Help'
    },
    children: [ { path: '**', data: { docsParent: 'help' }, component: DocsComponent } ]
  },
  { path: 'status',
    data: {
      title: 'Status'
    },
    children: [ { path: '**', data: { docsParent: 'status' }, component: DocsComponent } ]
  },
  { path: 'documentation',
    data: {
      title: 'Documentation'
    },
    children: [ { path: '**', data: { docsParent: 'documentation' }, component: DocsComponent } ]
  },
  { path: 'browse-curation',
    data: {
      title: 'Curation'
    },
    children: [ { path: '**', data: { docsParent: 'browse-curation' }, component: DocsComponent } ]
  },
  { path: 'query', component: QueryBuilderComponent,
    data: {
      title: 'Advanced search'
    }
  },
  { path: 'query/from/:type/:id/:name', component: QueryBuilderComponent,
    data: {
      title: 'Advanced search'
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
