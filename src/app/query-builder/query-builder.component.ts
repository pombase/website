import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { GeneQuery, TermNode, SubsetNode, Ploidiness, NodeEventDetails } from '../pombase-query';
import { QueryService } from '../query.service';
import { ToastrService } from 'ngx-toastr';
import { getAppConfig } from '../config';
import { Title } from '@angular/platform-browser';
import { SettingsService } from '../settings.service';
import { QueryRouterService } from '../query-router.service';

@Component({
  selector: 'app-query-builder',
  templateUrl: './query-builder.component.html',
  styleUrls: ['./query-builder.component.css']
})
export class QueryBuilderComponent implements OnInit {
  startNodeType?: string;
  appConfig = getAppConfig();

  constructor(private queryService: QueryService,
              private route: ActivatedRoute,
              private queryRouterService: QueryRouterService,
              private titleService: Title,
              private settingsService: SettingsService,
              private toastr: ToastrService,
             ) {

  }

  ngOnInit() {
    this.titleService.setTitle(this.appConfig.site_name + ' - Advanced search');
    this.route.params.forEach((params: Params) => {
      this.startNodeType = undefined;

      let fromType = params['type'];
      let termId = params['id'];
      let termName = params['name'];
      if (fromType && termId && termName) {
        this.processFromRoute(fromType, termId, termName);
        return;
      }

      const subsetName = params['subsetName'];
      if (subsetName) {
        this.saveFromSubsetName(subsetName);
        return;
      }

      const nodeTypeId = params['nodeTypeId'];
      if (nodeTypeId) {
        this.startNodeType = nodeTypeId;
        return;
      }

    });
  }

  private saveFromSubsetName(subsetName: string): void {
    const constraints = new SubsetNode(undefined, subsetName);
    const query = new GeneQuery(constraints);
    this.saveQuery(query);
  }

  processFromRoute(fromType: string, termId: string, encodedTermName: string) {
    let newQuery = null;

    if (fromType === 'term_subset') {
      let singleOrMulti = undefined;
      let ploidiness: Ploidiness|undefined = undefined;
      const matches = termId.match(/^([^:]+):/);
      if (matches && getAppConfig().phenotypeIdPrefixes.indexOf(matches[1]) !== -1) {
        // only set if the termid is from a phenotype CV
        singleOrMulti = 'single';
        ploidiness = 'haploid';
      }
      const termName = decodeURIComponent(encodedTermName);
      const constraints =
        new TermNode(undefined, termId, termName, undefined,
                     singleOrMulti, ploidiness, undefined, [], []);
      newQuery = new GeneQuery(constraints);
    }

    if (newQuery) {
      this.saveQuery(newQuery);
    }
  }

  gotoResults(query: GeneQuery) {
    this.queryRouterService.gotoResults(query);
  }

  saveQuery(query: GeneQuery) {
    this.queryService.runAndSaveToHistory(query);
  }

  nodeEvent(nodeEventDetails?: NodeEventDetails) {
    if (nodeEventDetails) {
      const query = new GeneQuery(nodeEventDetails.node);
      this.saveQuery(query);

      this.toastr.success('Query results added to history below');

      if (nodeEventDetails.nodeConf!.extraResultTableColumns) {
        this.settingsService.addVisibleGenesTableFields(nodeEventDetails.nodeConf!.extraResultTableColumns);
      }
    }
  }
}
