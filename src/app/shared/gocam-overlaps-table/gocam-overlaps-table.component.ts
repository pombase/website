import { Component, OnInit } from '@angular/core';

import { PombaseAPIService, GoCamGene, GeneSummary, GoCamComponent, GoCamProcess, GoCamChemical, GoCamComplex, GoCamModelId, GoCamModelTitle, GoCamDirection } from '../../pombase-api.service';

interface DisplayOverlap {
  node_id: string;
  node_label: string;
  enabledByGene?: GeneSummary;
  enabledByChemical?: GoCamChemical;
  enabledByComplex?: GoCamComplex;
  located_in?: GoCamComponent;
  occurs_in?: { [componentType: string]: GoCamComponent };
  occursInComponents: Array<GoCamComponent>;
  part_of_process: GoCamProcess;
  overlapping_individual_ids: Array<string>;
  models: Array<[GoCamModelId, GoCamModelTitle, GoCamDirection]>;
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
          let enabledByChemical;
          let enabledByComplex;
          if (nodeTypeAny.activity) {
            if (nodeTypeAny.activity.gene) {
              enabledByGene = nodeTypeAny.activity.gene as GoCamGene;
            } else if (nodeTypeAny.activity.chemical) {
              enabledByChemical = nodeTypeAny.activity.chemical as GoCamChemical;
            } else if (nodeTypeAny.activity.complex) {
              enabledByComplex = nodeTypeAny.activity.complex as GoCamComplex;
            }
          }
          if (!enabledByGene && !enabledByChemical && !enabledByComplex) {
            return [];
          }
          const displayOverlap =
            Object.assign(overlap,
                          { occursInComponents: [], modelIdTitles: [], mergedIds: '' }) as DisplayOverlap;
          if (enabledByGene) {
            const geneId = enabledByGene.id.replace("PomBase:", "");
            displayOverlap.enabledByGene = geneSummMap[geneId];
          }
          if (enabledByChemical) {
            displayOverlap.enabledByChemical = enabledByChemical;
          }

          if (enabledByComplex) {
            displayOverlap.enabledByComplex = enabledByComplex;
          }

          displayOverlap.modelIdTitles = [];

          let overlapModels = overlap.models;

          overlapModels.sort((a, b) => {
            const aModelId = a[0];
            let aDirection = a[2];
            const bModelId = b[2];
            let bDirection = b[2];

            if (aDirection == 'IncomingConstitutivelyUpstream') {
              aDirection = 'Incoming';
            }
            if (bDirection == 'IncomingConstitutivelyUpstream') {
              bDirection = 'Incoming';
            }
            if (aDirection == bDirection) {
              return aModelId.localeCompare(bModelId);
            }
            if (aDirection == 'Incoming' || bDirection == 'Outgoing') {
              return -1;
            }
            if (aDirection == 'Outgoing' || bDirection == 'Incoming') {
              return 1;
            }
            return 0;
          });

          for (const [modelId, modelTitle] of overlapModels) {
            const shortModelId = modelId.replace('gomodel:', '');

            displayOverlap.modelIdTitles.push([shortModelId, modelTitle]);
          }
          displayOverlap.mergedIds =
            overlapModels.map(([id, _]) => id.replace('gomodel:', '')).join('+');
          if (overlap.occurs_in) {
            overlap.occurs_in.map(occursIn => {
              const occursInComp = occursIn['other_component'] || occursIn['complex_component'];
              displayOverlap.occursInComponents.push(occursInComp);
            });
          }

          return [displayOverlap];
        });
      })
  }

  ngOnInit(): void {

  }
}
