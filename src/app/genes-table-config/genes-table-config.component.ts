import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/';
import { SettingsService } from '../settings.service';
import { getAppConfig, GeneResultsFieldConfig } from '../config';

@Component({
  selector: 'app-genes-table-config',
  templateUrl: './genes-table-config.component.html',
  styleUrls: ['./genes-table-config.component.css']
})
export class GenesTableConfigComponent implements OnInit {

  allFields: Array<GeneResultsFieldConfig> = [];
  visibleFields: Array<GeneResultsFieldConfig> = [];

  selectedFieldNames: { [key: string]: boolean } = {};

  constructor(public bsModalRef: BsModalRef,
              private settingsService: SettingsService) {

    this.allFields = getAppConfig().getGeneResultsConfig().geneTableFields;

    settingsService.visibleGenesTableFieldNames
      .map(fieldName => this.selectedFieldNames[fieldName] = true);

    for (const fieldConfig of this.allFields) {
      if (fieldConfig.column_group === 'extra') {
        if (this.selectedFieldNames[fieldConfig.name]) {
          this.visibleFields = this.allFields;
          break;
        }
      } else {
        this.visibleFields.push(fieldConfig);
      }
    }
  }

  apply(): void {
    this.settingsService.visibleGenesTableFieldNames = this.getSelectedFieldNames();
    this.bsModalRef.hide()
  }

  allFieldsAreVisible(): boolean {
    return this.visibleFields.length === this.allFields.length;
  }

  showAllFields(): void {
    this.visibleFields = this.allFields;
  }

  fieldChange(fieldName: string): void {
    if (this.getSelectedFieldNames().length === 0) {
      if (fieldName === 'uniquename') {
        this.selectedFieldNames['name'] = true;
      } else {
        this.selectedFieldNames['uniquename'] = true;
      }
    }
  }

  fieldContainerStyle(): any {
    const numRows = Math.trunc((this.allFields.length + 5) / 2);
    return {
      'grid-template-rows': 'repeat(' + numRows + ', auto)',
    }
  }

  resetSelection() {
    this.selectedFieldNames = {};
    this.settingsService.defaultVisibleFieldNames
      .map(fieldName => this.selectedFieldNames[fieldName] = true);
  }

  private getSelectedFieldNames(): Array<string> {
    return Object.keys(this.selectedFieldNames).filter(name => this.selectedFieldNames[name]);
  }

  ngOnInit(): void {
  }
}
