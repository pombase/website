import { GeneticInteractionTable } from '../pombase-api.service';
import { Filter } from '../filtering';
import { InteractionTypeFilterCategory } from '../config';

export class GeneticInteractionTypeFilter implements Filter <GeneticInteractionTable> {
  constructor(private interactionType: InteractionTypeFilterCategory) {}


  filter(interactionTable: GeneticInteractionTable): [GeneticInteractionTable, number, number] {
    let retTable = [];
    let count = interactionTable.length;

    for (const interaction of interactionTable) {
      if (this.interactionType == interaction.interaction_type) {
        retTable.push(interaction);
      }
    }

    return [retTable, count, retTable.length];
  }
}