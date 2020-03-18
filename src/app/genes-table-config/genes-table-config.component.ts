import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/';
import { SettingsService } from '../settings.service';
import { GeneSummary } from '../pombase-api.service';
import { getAppConfig, GeneResultsFieldConfig } from '../config';
import { DeployConfigService } from '../deploy-config.service';

@Component({
  selector: 'app-genes-table-config',
  templateUrl: './genes-table-config.component.html',
  styleUrls: ['./genes-table-config.component.css']
})
export class GenesTableConfigComponent implements OnInit {

  fields: Array<GeneResultsFieldConfig> = [];

  selectedFieldNames: { [key: string]: boolean } = {};

  constructor(public bsModalRef: BsModalRef,
              private settingsService: SettingsService,
              public deployConfigService: DeployConfigService) {
    this.fields = getAppConfig().getGeneResultsConfig().geneTableFields;
    settingsService.visibleGenesTableFieldNames
      .map(fieldName => this.selectedFieldNames[fieldName] = true);
  }

  apply(): void {
    this.settingsService.visibleGenesTableFieldNames = this.getSelectedFieldNames();
    this.bsModalRef.hide()
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
