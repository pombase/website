import { Component, OnInit } from '@angular/core';
import { Subject } from "rxjs";

import { BsModalRef } from 'ngx-bootstrap/modal';
import { GeneQuery } from '../pombase-query';

type Direction = 'forward'|'reverse'|'cancel';

@Component({
  selector: 'app-not-direction-select-dialog',
  templateUrl: './not-direction-select-dialog.component.html',
  styleUrls: ['./not-direction-select-dialog.component.css']
})
export class NotDirectionSelectDialogComponent implements OnInit {

  direction: Direction = 'forward';
  selectedQueries: Array<GeneQuery>;
  firstQueryDisplayName: string;
  secondQueryDisplayName: string;

  constructor(public _bsModalRef: BsModalRef) { }

  public onClose: Subject<Direction>;

  private setDirection(): void {
    this.firstQueryDisplayName =
      this.selectedQueries[0].getQueryName() || this.selectedQueries[0].toString();
    this.secondQueryDisplayName =
      this.selectedQueries[1].getQueryName() || this.selectedQueries[1].toString();
    if (this.direction === 'reverse') {
      [this.firstQueryDisplayName, this.secondQueryDisplayName] =
        [this.secondQueryDisplayName, this.firstQueryDisplayName];
    }
  }

  public ngOnInit(): void {
    this.onClose = new Subject();
    this.setDirection();
  }

  public changeDirection(): void {
    if (this.direction === 'forward') {
      this.direction = 'reverse';
    } else {
      this.direction = 'forward';
    }
    this.setDirection();
  }

  public query(): void {
    this.onClose.next(this.direction);
    this._bsModalRef.hide();
  }

  public cancel(): void {
    this.onClose.next('cancel');
    this._bsModalRef.hide();
  }

  ngOnDestroy() {
     this._bsModalRef.content.onClose.unsubscribe();
  }
}
