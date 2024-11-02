import { Component, OnInit } from '@angular/core';

import { BsModalRef } from 'ngx-bootstrap/modal';
import { GeneQuery } from '../pombase-query';
import { QueryRouterService } from '../query-router.service';

@Component({
  selector: 'app-query-details-dialog',
  templateUrl: './query-details-dialog.component.html',
  styleUrls: ['./query-details-dialog.component.css']
})
export class QueryDetailsDialogComponent implements OnInit {
  public query: GeneQuery;
  public showInternalDetails: boolean;

  constructor(private queryRouterService: QueryRouterService,
              public bsModalRef: BsModalRef) { }

  gotoResults(query: GeneQuery) {
    this.bsModalRef.hide();
    this.queryRouterService.gotoResults(query);
  }

  ngOnInit() {
  }
}
