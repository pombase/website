import { GeneticInteractionGroup } from '../pombase-api.service';

export interface GeneticInteractionFilter {
  filter(interactionTable: GeneticInteractionGroup): [InteractionTable, number, number];
}
