import { NgModule } from '@angular/core';
import { Routes, RouterModule, NoPreloading } from '@angular/router';

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
import { RouterNotFoundHandlerComponent } from './router-not-found-handler/router-not-found-handler.component';
import { PanelArchiveComponent } from './panel-archive/panel-archive.component';
import { ReferenceDetailListPageComponent } from './reference-detail-list-page/reference-detail-list-page.component';
import { MotifSearchComponent } from './motif-search/motif-search.component';
import { IdentifierMapperComponent } from './identifier-mapper/identifier-mapper.component';
import { GeneResultsPageComponent } from './gene-results-page/gene-results-page.component';
import { InternalDetailsComponent } from './internal-details/internal-details.component';
import { IdentifierMapperResultsComponent } from './identifier-mapper-results/identifier-mapper-results.component';

const routes: Routes = [
  { path: 'gene/:uniquename', component: GeneDetailsComponent,
    data: {
    }
  },
  { path: 'gene_subset/:subsetName', component: GeneSubsetViewComponent,
    data: {
    }
  },
  { path: 'genotype/:uniquename', component: GenotypeDetailsComponent,
    data: {
    }
  },
  { path: 'spombe/:wildcard/:uniquename', component: GeneDetailsComponent,
    data: {
    }
  },
  { path: 'term/:termid', component: TermDetailsComponent,
    data: {
    }
  },
  { path: 'term_genes/:termid', component: TermGenesViewComponent,
    data: {
    }
  },
  { path: 'term_genotypes/:termid', component: TermGenotypesViewComponent,
    data: {
    }
  },
  { path: 'term_single_allele_genotype_genes/:termid', component: TermSingleGeneGenotypesViewComponent,
    data: {
    }
  },
  { path: 'reference/:uniquename', component: ReferenceDetailsComponent,
    data: {
    }
  },
  { path: 'reference_list/:constraint', component: ReferenceDetailListPageComponent,
    data: {
      defaultTitleDetail: 'References'
    }
  },
  { path: 'archive/:archiveType', component: PanelArchiveComponent,
    data: {
      defaultTitleDetail: 'Panel archive'
    }
  },
  { path: 'community',
    loadChildren: () => import('./documentation/documentation.module').then(m => m.DocumentationModule),
  },
  { path: 'about',
    loadChildren: () => import('./documentation/documentation.module').then(m => m.DocumentationModule),
  },
  { path: 'help',
    loadChildren: () => import('./documentation/documentation.module').then(m => m.DocumentationModule),
  },
  { path: 'status',
    loadChildren: () => import('./documentation/documentation.module').then(m => m.DocumentationModule),
  },
  { path: 'documentation',
    loadChildren: () => import('./documentation/documentation.module').then(m => m.DocumentationModule),
  },
  { path: 'datasets',
    loadChildren: () => import('./documentation/documentation.module').then(m => m.DocumentationModule),
  },
  { path: 'downloads',
    loadChildren: () => import('./documentation/documentation.module').then(m => m.DocumentationModule),
  },
  { path: 'documents',
    loadChildren: () => import('./documentation/documentation.module').then(m => m.DocumentationModule),
  },
  { path: 'news',
    loadChildren: () => import('./documentation/documentation.module').then(m => m.DocumentationModule),
  },
  { path: 'faq',
    loadChildren: () => import('./documentation/documentation.module').then(m => m.DocumentationModule),
  },
  { path: 'browse-curation',
    loadChildren: () => import('./documentation/documentation.module').then(m => m.DocumentationModule),
  },
  { path: 'submit-data',
    loadChildren: () => import('./documentation/documentation.module').then(m => m.DocumentationModule),
  },
  { path: 'gene-names',
    loadChildren: () => import('./documentation/documentation.module').then(m => m.DocumentationModule),
  },
  { path: 'internal-details', component: InternalDetailsComponent,
    data: {
      defaultTitleDetail: 'Internal details'
    }
  },
  { path: 'query', component: QueryBuilderComponent,
    data: {
      defaultTitleDetail: 'Advanced search'
    }
  },
  { path: 'query/start_from/:nodeTypeId', component: QueryBuilderComponent,
    data: {
      defaultTitleDetail: 'Advanced search'
    }
  },
  { path: 'query/save/from/subset/:subsetName/:subsetDisplayName',
    component: QueryBuilderComponent,
    data: {
      defaultTitleDetail: 'Advanced search'
    }
  },
  { path: ':mode/from/id/:id', component: GeneResultsPageComponent,
    data: {
      defaultTitleDetail: 'Search results'
    }
  },
  { path: ':mode/from/json/:json', component: GeneResultsPageComponent,
    data: {
      defaultTitleDetail: 'Search results'
    }
  },
  { path: ':mode/from/predefined/:predefinedQueryId', component: GeneResultsPageComponent,
    data: {
      defaultTitleDetail: 'Search results'
    }
  },
  { path: 'query/save/from/:type/:id/:name', component: QueryBuilderComponent,
    data: {
      defaultTitleDetail: 'Advanced search'
    }
  },

  { path: 'motif_search', component: MotifSearchComponent,
    data: {
      defaultTitleDetail: 'Motif search'
    }
  },
  { path: 'identifier-mapper', component: IdentifierMapperComponent,
    data: {
      defaultTitleDetail: 'Identifier mapper'
    }
  },
  { path: 'identifier-mapper-results', component: IdentifierMapperResultsComponent,
    data: {
      defaultTitleDetail: 'Identifier mapper results'
    }
  },
  { path: 'front', redirectTo: '/', pathMatch: 'full' },
  {
    path: '', component: FrontComponent,
    data: {
      defaultTitleDetail: 'The Schizosaccharomyces pombe genome database'
    }
  },
  {
    path: '**',
    component: RouterNotFoundHandlerComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: NoPreloading,
                                           scrollPositionRestoration: 'enabled' }),
  ],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
