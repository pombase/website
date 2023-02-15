import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { GeneDetails, GeneHistoryEntry } from '../pombase-api.service';
import { Util } from '../shared/util';

type RefOrText = {
  text?: string;
  referenceUniquename?: string;
}

interface ProcessedHistoryEntry extends GeneHistoryEntry {
  processedReferences: Array<Array<RefOrText>>;
}

@Component({
  selector: 'app-gene-history-table',
  templateUrl: './gene-history-table.component.html',
  styleUrls: ['./gene-history-table.component.css']
})
export class GeneHistoryTableComponent implements OnInit, OnChanges {
  @Input() geneDetails: GeneDetails;

  processedHistory: Array<ProcessedHistoryEntry> = [];

  constructor() { }

  ngOnInit(): void {
  }

  currentStructure(): string {
    if (this.geneDetails.transcripts.length == 0) {
      return '';
    } else {
      return Util.transcriptStructureAsString(this.geneDetails.transcripts[0]);
    }
  }

  ngOnChanges(): void {
    this.processedHistory = [];

    for (const historyEntry of this.geneDetails.gene_history) {
      let processedHistoryEntry = Object.assign({}, historyEntry) as ProcessedHistoryEntry;
      processedHistoryEntry.processedReferences = [];
      for (const ref of processedHistoryEntry.references) {
        let refParts = [];
        for (const part of ref.split(/(PMID:\d\d\d+)/)) {
          let text = undefined;
          let referenceUniquename = undefined;

          if (part.match(/^(PMID:\d\d\d+)$/)) {
            referenceUniquename = part;
          } else {
            text = part;
          }

          const processedRef = {
            text,
            referenceUniquename,
          } as RefOrText;

          refParts.push(processedRef);
        }

        processedHistoryEntry.processedReferences.push(refParts);
      }

      this.processedHistory.push(processedHistoryEntry);
    }
  }
}
