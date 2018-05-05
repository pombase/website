import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { Angulartics2Module } from 'angulartics2';
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';

import { GeneDetailsComponent } from './gene-details/gene-details.component';
import { GenotypeDetailsComponent } from './genotype-details/genotype-details.component';
import { TermDetailsComponent } from './term-details/term-details.component';
import { TermGenesViewComponent } from './term-genes-view/term-genes-view.component';
import { GeneSubsetViewComponent } from './gene-subset-view/gene-subset-view.component';
import { TermGenotypesViewComponent } from './term-genotypes-view/term-genotypes-view.component';
import { TermSingleGeneGenotypesViewComponent } from './term-single-gene-genotypes-view/term-single-gene-genotypes-view.component';
import { ReferenceDetailsComponent } from './reference-details/reference-details.component';
import { QueryBuilderComponent } from './query-builder/query-builder.component';
import { FrontComponent } from './front/front.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { PanelArchiveComponent } from './panel-archive/panel-archive.component';
import { ReferenceDetailListPageComponent } from './reference-detail-list-page/reference-detail-list-page.component';

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
  { path: 'spombe/:wildcard/:uniquename', component: GeneDetailsComponent,
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
  { path: 'reference_list/:constraint', component: ReferenceDetailListPageComponent,
    data: {
      title: 'References'
    }
  },
  { path: 'archive/:archiveType', component: PanelArchiveComponent,
    data: {
      title: 'Panel archive'
    }
  },
  { path: 'community',
    loadChildren: './documentation/documentation.module#DocumentationModule',
  },
  { path: 'about',
    loadChildren: './documentation/documentation.module#DocumentationModule',
  },
  { path: 'help',
    loadChildren: './documentation/documentation.module#DocumentationModule',
  },
  { path: 'status',
    loadChildren: './documentation/documentation.module#DocumentationModule',
  },
  { path: 'documentation',
    loadChildren: './documentation/documentation.module#DocumentationModule',
  },
  { path: 'datasets',
    loadChildren: './documentation/documentation.module#DocumentationModule',
  },
  { path: 'downloads',
    loadChildren: './documentation/documentation.module#DocumentationModule',
  },
  { path: 'documents',
    loadChildren: './documentation/documentation.module#DocumentationModule',
  },
  { path: 'news',
    loadChildren: './documentation/documentation.module#DocumentationModule',
  },
  { path: 'faq',
    loadChildren: './documentation/documentation.module#DocumentationModule',
  },
  { path: 'browse-curation',
    loadChildren: './documentation/documentation.module#DocumentationModule',
  },
  { path: 'submit-data',
    loadChildren: './documentation/documentation.module#DocumentationModule',
  },
  { path: 'gene-names',
    loadChildren: './documentation/documentation.module#DocumentationModule',
  },
  { path: 'query', component: QueryBuilderComponent,
    data: {
      title: 'Advanced search'
    }
  },
  { path: 'query/start_from/:nodeTypeId', component: QueryBuilderComponent,
    data: {
      title: 'Advanced search'
    }
  },
  { path: 'query/:saveOrResults/from/subset/:subsetName/:subsetDisplayName',
    component: QueryBuilderComponent,
    data: {
      title: 'Advanced search'
    }
  },
  { path: 'query/results/from/history/:historyEntryId', component: QueryBuilderComponent,
    data: {
      title: 'Advanced search'
    }
  },
  { path: 'query/save/from/:type/:id/:name', component: QueryBuilderComponent,
    data: {
      title: 'Advanced search'
    }
  },
  { path: 'query/:saveOrResults/from/predefined/:predefinedQueryId', component: QueryBuilderComponent,
    data: {
      title: 'Advanced search'
    }
  },
  { path: 'query/:saveOrResults/from/json/:json', component: QueryBuilderComponent,
    data: {
      title: 'Advanced search'
    }
  },
  { path: 'front', redirectTo: '/', pathMatch: 'full' },
  {
    path: '', component: FrontComponent,
    data: {
      title: 'The S. pombe genome database'
    }
  },
  {
    path: '**',
    component: NotFoundComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
            Angulartics2Module.forRoot([ Angulartics2GoogleAnalytics ])],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
