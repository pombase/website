import { InteractionTable, ThroughputType } from '../pombase-api.service';
import { Filter } from '../filtering';

export class InteractionThroughputFilter implements Filter<InteractionTable> {
  constructor(private throughputType: ThroughputType) { }

  filter(interactionTable: InteractionTable): [InteractionTable, number, number] {
    let retTable = [] as InteractionTable;
    let count = interactionTable.length;

    for (let interaction of interactionTable) {
      if (interaction.throughput && interaction.throughput === this.throughputType) {
         retTable.push(interaction);
      }
    }

    return [retTable, count, retTable.length];
  }
}
