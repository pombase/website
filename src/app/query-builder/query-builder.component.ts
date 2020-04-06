import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { GeneQuery, GeneQueryNode, TermNode, SubsetNode } from '../pombase-query';
import { QueryService } from '../query.service';
import { ToastrService } from 'ngx-toastr';
import { getAppConfig, QueryNodeConfig } from '../config';
import { Title } from '@angular/platform-browser';
import { SettingsService } from '../settings.service';
import { QueryRouterService } from '../query-router.service';

@Component({
  selector: 'app-query-builder',
  templateUrl: './query-builder.component.html',
  styleUrls: ['./query-builder.component.css']
})
export class QueryBuilderComponent implements OnInit {
  startNodeType: number = null;
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
      this.startNodeType = null;

      let fromType = params['type'];
      let termId = params['id'];
      let termName = params['name'];
      if (fromType && termId && termName) {
        this.processFromRoute(fromType, termId, termName);
        return;
      }

      const subsetName = params['subsetName'];
      let subsetDisplayName = params['subsetDisplayName'];
      if (subsetName) {
        let decodedSubsetDisplayName = '';
        if (subsetDisplayName) {
          decodedSubsetDisplayName = decodeURIComponent(subsetDisplayName);
        }
        this.saveFromSubsetName(subsetName, decodedSubsetDisplayName);
        return;
      }

      const nodeTypeId = params['nodeTypeId'];
      if (nodeTypeId) {
        this.startNodeType = nodeTypeId;
        return;
      }

    });
  }

  private saveFromSubsetName(subsetName: string, subsetDisplayName: string): void {
    const constraints = new SubsetNode (subsetName, subsetDisplayName);
    const query = new GeneQuery(null, constraints);
    this.saveQuery(query);
  }

  processFromRoute(fromType: string, termId: string, encodedTermName: string) {
    let newQuery = null;

    if (fromType === 'term_subset') {
      let singleOrMulti = null;
      const matches = termId.match(/^([^:]+):/);
      if (matches && getAppConfig().phenotypeIdPrefixes.indexOf(matches[1]) !== -1) {
        // only set singleOrMulti if the termid is from a phenotype CV
        singleOrMulti = 'single';
      }
      const termName = decodeURIComponent(encodedTermName);
      const constraints = new TermNode(termId, termName, null, singleOrMulti, null, [], []);
      newQuery = new GeneQuery(null, constraints);
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

  nodeEvent({ node, nodeConf }: {node: GeneQueryNode, nodeConf: QueryNodeConfig}) {
    if (node) {
      const query = new GeneQuery(null, node);
      this.saveQuery(query);

      this.toastr.success('Query results added to history below');

      if (nodeConf.extraResultTableColumns) {
        this.settingsService.addVisibleGenesTableFields(nodeConf.extraResultTableColumns);
      }
    }
  }
}
