import { Component, OnInit, Input } from '@angular/core';

import { GeneDetails } from '../pombase-api.service';

@Component({
  selector: 'app-deletion-viability-summary',
  templateUrl: './deletion-viability-summary.component.html',
  styleUrls: ['./deletion-viability-summary.component.css']
})
export class DeletionViabilitySummaryComponent implements OnInit {
  @Input() geneDetails: GeneDetails;

  getViabilityClass(): string {
    if (this.geneDetails.deletion_viability) {
      if (this.geneDetails.deletion_viability === 'depends_on_conditions') {
        return 'depends';
      } else {
        return this.geneDetails.deletion_viability;
      }
    } else {
      return 'unknown';
    }
  }

  getDisplayViability(): string {
    let viabilityClass = this.getViabilityClass();
    if (viabilityClass === 'depends') {
      return 'Depends on conditions';
    } else {
      return viabilityClass.charAt(0).toUpperCase() + viabilityClass.slice(1); ;
    }
  }

  constructor() { }

  ngOnInit() {
  }
}
