import { Component } from '@angular/core';
import { GoCamActivity, GoCamComponent, GoCamNodeType,
         GoCamProcess, PombaseAPIService } from '../../pombase-api.service';

interface DisplayNode {
  node_id: string;
  label: string;
  node_type: GoCamNodeType;
  occurs_in: Array<GoCamComponent>;
  part_of_process: GoCamProcess;
  has_input: string;
  has_output: string;
  modelId: string;
  modelTitle: string;
}

@Component({
  selector: 'app-gocam-holes-table',
  templateUrl: './gocam-holes-table.component.html',
  styleUrl: './gocam-holes-table.component.css',
  standalone: false,
})
export class GoCamHolesTableComponent {
  displayNodes: Array<DisplayNode> = [];

  constructor(pombaseApi: PombaseAPIService) {
    pombaseApi.getGoCamHoles()
      .then(holes => {
        holes.map(node => {
          let [modelId, modelTitle] = node.models[0];
          modelId = modelId.replace('gomodel:', '');

          const nodeTypeAny = node.node_type as any;

          let occurs_in: Array<GoCamComponent> = [];

          if (node.occurs_in) {
            occurs_in =
              node.occurs_in.map(o => o['other_component'] || o['complex_component']);
          }

          if (nodeTypeAny.activity) {
            let activity = nodeTypeAny.activity as GoCamActivity;

            let has_input;

            if (activity.inputs && activity.inputs.length != 0) {
              const labels = activity.inputs.map((input) => input.label);
              has_input = labels.join(',');
            } else {
              has_input = '?';
            }

            let has_output;

            if (activity.outputs && activity.outputs.length != 0) {
              const labels = activity.outputs.map((output) => output.label);
              has_output = labels.join(',');
            } else {
              has_output = '?';
            }

            const displayNode = {
              node_id: node.node_id,
              label: node.label,
              part_of_process: node.part_of_process,
              occurs_in,
              has_input,
              has_output,
              modelId,
              modelTitle,
            } as DisplayNode;

            this.displayNodes.push(displayNode);
          }
        })

        this.displayNodes.sort((a, b) => {
          return a.modelTitle.toLocaleLowerCase().localeCompare(b.modelTitle.toLocaleLowerCase())
        });
      })
  }
}
