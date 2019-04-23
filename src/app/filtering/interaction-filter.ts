import { InteractionTable } from '../pombase-api.service';

export interface InteractionFilter {
  filter(interactionTable: InteractionTable): [InteractionTable, number, number];
}
