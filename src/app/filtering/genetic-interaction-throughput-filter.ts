import { GeneticInteractionTable, ThroughputType } from '../pombase-api.service';
import { Filter } from '../filtering';

export class GeneticInteractionThroughputFilter implements Filter<GeneticInteractionTable> {
  constructor(private throughputType: ThroughputType) { }

  filter(interactionTable: GeneticInteractionTable): [GeneticInteractionTable, number, number] {
    let retTable: GeneticInteractionTable = [];
    let count = interactionTable.length;


   for (const interaction of interactionTable) {
     let matchingDetails = [];

     for (const detail of interaction.details) {
       if (detail.throughput && detail.throughput === this.throughputType) {
         matchingDetails.push(detail);
       }
     }

     if (matchingDetails.length > 0) {
       let interactionCopy = Object.assign({}, interaction);
       interactionCopy.details = matchingDetails;

       retTable.push(interactionCopy);
     }
   }

    return [retTable, count, retTable.length];
  }
}
