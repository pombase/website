import { Component, Input, OnInit } from '@angular/core';
import { GeneDetails } from '../pombase-api.service';

@Component({
  selector: 'app-gene-history-table',
  templateUrl: './gene-history-table.component.html',
  styleUrls: ['./gene-history-table.component.css']
})
export class GeneHistoryTableComponent implements OnInit {
  @Input() geneDetails: GeneDetails;

  constructor() { }

  ngOnInit(): void {
  }

}
