import { InteractionTable } from '../pombase-api.service';
import { Filter } from '../filtering';
import { InteractionTypeFilterCategory } from '../config';

export class InteractionTypeFilter implements Filter <InteractionTable> {
  constructor(private interactionType: InteractionTypeFilterCategory) {}


  filter(interactionTable: InteractionTable): [InteractionTable, number, number] {
    let retTable: InteractionTable = [];
    let count = interactionTable.length;

    for (const interaction of interactionTable) {
      if (this.interactionType == interaction.evidence) {
        retTable.push(interaction);
      }
    }

    return [retTable, count, retTable.length];
  }

  getInteractionType(): InteractionTypeFilterCategory {
    return this.interactionType;
  }
}
