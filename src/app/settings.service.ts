import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';
import { getAppConfig } from './config';
import { TermShort } from './pombase-query';

export type GenePageWidget = 'none' | 'protein_feature_viewer' | 'gocam_viewer' | 'genome_browser' | 'alphafold_viewer' | 'pdb_viewer' | 'rna_2d_structure';
export type TermPageWidget = 'none' | 'rhea_reaction' | 'gocam_viewer';

const localStorageKey = 'pombase-settings-v3';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  constructor() {
    const settingsJson = localStorage.getItem(localStorageKey);

    if (settingsJson) {
       try {
         const savedSettings = JSON.parse(settingsJson);
         if (savedSettings.genePageMainWidget) {
           this._genePageMainWidget = savedSettings.genePageMainWidget;
         }
         if (savedSettings.termPageMainWidget) {
           this._termPageMainWidget = savedSettings.termPageMainWidget;
         }
       } catch (e: any) {
         console.log('failed to deserialise settings: ' + e.message);
       }
    }
  }

  private readonly _defaultVisibleFieldNames = ['uniquename', 'name', 'product'];

  private searchText = '';

  private readonly _visibleGenesTableFieldNames =
    new BehaviorSubject<Array<string>>(this._defaultVisibleFieldNames);

  readonly visibleGenesTableFieldNames$ = this._visibleGenesTableFieldNames.asObservable();

  private _genePageMainWidget: GenePageWidget = 'alphafold_viewer';
  private _termPageMainWidget: TermPageWidget = 'rhea_reaction';

  private settingsAsJson(): string {
    return JSON.stringify({
      genePageMainWidget: this._genePageMainWidget,
      termPageMainWidget: this._termPageMainWidget,
    });
  }

  private saveSettings() {
    localStorage.setItem(localStorageKey, this.settingsAsJson());
  }

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

  get defaultVisibleFieldNames(): Array<string> {
    return this._defaultVisibleFieldNames;
  }

  resetVisibleFields() {
    this.visibleGenesTableFieldNames = ['uniquename', 'name', 'product'];
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

  private readonly _extraGeneVisColumns =
    new BehaviorSubject<Array<TermShort>>([]);

  readonly extraGeneVisColumns$ = this._extraGeneVisColumns.asObservable();

  get extraGeneVisColumns(): Array<TermShort> {
    return this._extraGeneVisColumns.getValue();
  }

  set extraGeneVisColumns(newExtraGeneVisColumns: Array<TermShort>) {
    this._extraGeneVisColumns.next(newExtraGeneVisColumns);
  }

  resetExtraGeneVisColumns() {
    this.extraGeneVisColumns = [];
  }

  addExtraGeneVisColumns(terms: Array<TermShort>): void {
    let newColumns = this.extraGeneVisColumns;
    let changed = false;
    terms.map(term => {
      if (newColumns.filter(currentTerm => {
        return term.termid == currentTerm.termid;
      }).length == 0) {
        newColumns.push(term);
        changed = true;
      }
    });
    if (changed) {
      this.extraGeneVisColumns = newColumns;
    }
  }

  removeExtraGeneVisColumn(termid: string) {
    let newColumns =
      this.extraGeneVisColumns.filter(term => {
        return term.termid !== termid;
      });

    if (newColumns.length != this.extraGeneVisColumns.length) {
      this.extraGeneVisColumns = newColumns;
    }
  }

  get currentSearchText(): string {
    return this.searchText;
  }

  set currentSearchText(text: string) {
    this.searchText = text;
  }

  get genePageMainWidget(): GenePageWidget {
    return this._genePageMainWidget;
  }

  set genePageMainWidget(widgetType: GenePageWidget) {
    this._genePageMainWidget = widgetType;
    this.saveSettings();
  }

  get termPageMainWidget(): TermPageWidget {
    return this._termPageMainWidget;
  }

  set termPageMainWidget(widgetType: TermPageWidget) {
    this._termPageMainWidget = widgetType;
    this.saveSettings();
  }
}
