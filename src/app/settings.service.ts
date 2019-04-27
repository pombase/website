import { Injectable } from '@angular/core';

import { GeneSummary } from './pombase-api.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private readonly _visibleGenesTableColumns =
    new BehaviorSubject<Array<string>>(['Systematic ID', 'Gene name', 'Product description']);

  readonly visibleGenesTableColumns$ = this._visibleGenesTableColumns.asObservable();

  get visibleGenesTableColumns(): Array<string> {
    return this._visibleGenesTableColumns.getValue();
  }

  set visibleGenesTableColumns(val: Array<string>) {
    this._visibleGenesTableColumns.next(val);
  }
}
