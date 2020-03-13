import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';
import { getAppConfig } from './config';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private readonly _visibleGenesTableFieldNames =
    new BehaviorSubject<Array<string>>(['uniquename', 'name', 'product']);

  readonly visibleGenesTableFieldNames$ = this._visibleGenesTableFieldNames.asObservable();

  get visibleGenesTableFieldNames(): Array<string> {
    return this._visibleGenesTableFieldNames.getValue();
  }

  set visibleGenesTableFieldNames(val: Array<string>) {
    const genesTableFields = getAppConfig().getGeneResultsConfig().geneTableFields;
    const valSet = new Set(val);
    const newVisibleFieldNames =
      genesTableFields.filter(fieldConfig => valSet.has(fieldConfig.name))
        .map(fieldConfig => fieldConfig.name);
    this._visibleGenesTableFieldNames.next(newVisibleFieldNames);
  }

  addVisibleGenesTableFields(fieldNames: Array<string>): void {
    let visible = this.visibleGenesTableFieldNames;
    let changed = false;
    fieldNames.map(fieldName => {
      if (!visible.includes(fieldName)) {
        visible.push(fieldName);
        changed = true;
      }
    });
    if (changed) {
      this.visibleGenesTableFieldNames = visible;
    }
  }
}
