import { Component, OnInit } from '@angular/core';

import { PombaseAPIService, GoCamGene, GeneSummary, GoCamComponent, GoCamProcess } from '../../pombase-api.service';

interface DisplayOverlap {
  node_id: string;
  node_label: string;
  enabledByGene?: GeneSummary;
  located_in?: GoCamComponent;
  occurs_in?: { [componentType: string]: GoCamComponent };
  occursInComponent?: GoCamComponent;
  part_of_process: GoCamProcess;
  overlapping_individual_ids: Array<string>;
  model_ids: Array<string>;
  model_titles: Array<string>;
  modelIdTitles: Array<[string, string]>;
  mergedIds: string;
}

@Component({
  selector: 'app-gocam-overlaps-table',
  templateUrl: './gocam-overlaps-table.component.html',
  styleUrl: './gocam-overlaps-table.component.css',
  standalone: false
})
export class GocamOverlapsTableComponent implements OnInit {
  displayOverlaps: Array<DisplayOverlap> = [];

  constructor(pombaseApi: PombaseAPIService) {
    const summPromise = pombaseApi.getGeneSummaryMapPromise();
    const overlapsPromise = pombaseApi.getGoCamOverlaps();

    Promise.all([summPromise, overlapsPromise])
      .then(([geneSummMap, overlaps]) => {
        this.displayOverlaps = overlaps.flatMap(overlap => {
          const nodeTypeAny = overlap.node_type as any;
          let enabledByGene;
          if (nodeTypeAny.activity) {
            if (nodeTypeAny.activity.gene) {
              enabledByGene = nodeTypeAny.activity.gene as GoCamGene;
            }
          }
          if (!enabledByGene) {
            return [];
          }
          const displayOverlap =
            Object.assign(overlap, { modelIdTitles: [], mergedIds: '' }) as DisplayOverlap;
          const geneId = enabledByGene.id.replace("PomBase:", "");
          displayOverlap.enabledByGene = geneSummMap[geneId];

          displayOverlap.modelIdTitles = [];
          for (let i = 0; i < overlap.model_ids.length; i++) {
            const modelId = overlap.model_ids[i];
            const modelTitle = overlap.model_titles[i];
            displayOverlap.modelIdTitles.push([modelId, modelTitle]);
          }
          displayOverlap.mergedIds = overlap.model_ids.join('+');
          if (overlap.occurs_in) {
             displayOverlap.occursInComponent =
               overlap.occurs_in['other_component'] || overlap.occurs_in['complex_component'];
          }

          return [displayOverlap];
        });
      })
  }

  ngOnInit(): void {

  }
}
