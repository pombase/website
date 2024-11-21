import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { GeneDetails, GeneHistoryEntry } from '../pombase-api.service';
import { Util } from '../shared/util';

type RefOrText = {
  text?: string;
  referenceUniquename?: string;
}

const ftpLinkRE = /\/(\d\d\d\d\d\d\d\d)\/?$/;
const svnLinkRE = /\/trunk\/?\?p=(\d+)$/;

interface ProcessedHistoryEntry extends GeneHistoryEntry {
  processedReferences: Array<Array<RefOrText>>;
  processedShapshotLabel?: string;
}

@Component({
    selector: 'app-gene-history-table',
    templateUrl: './gene-history-table.component.html',
    styleUrls: ['./gene-history-table.component.css'],
    standalone: false
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

  genomeSnapshotLabel(entry: ProcessedHistoryEntry): string {
    return entry.processedShapshotLabel || 'File';
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

      const snapshotLink = historyEntry.genome_snapshot_link;

      if (snapshotLink) {
        const ftpMatch = ftpLinkRE.exec(snapshotLink)
        if (ftpMatch) {
          processedHistoryEntry.processedShapshotLabel = 'ftp:' + ftpMatch[1];
        } else {
          const svnMatch = svnLinkRE.exec(snapshotLink);
          if (svnMatch) {
            processedHistoryEntry.processedShapshotLabel = 'svn:' + svnMatch[1];
          }
        }
      }

      this.processedHistory.push(processedHistoryEntry);
    }
  }
}
