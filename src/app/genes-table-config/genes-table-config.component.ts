import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/';
import { SettingsService } from '../settings.service';
import { GeneSummary } from '../pombase-api.service';
import { getAppConfig } from '../config';
import { DeployConfigService } from '../deploy-config.service';

@Component({
  selector: 'app-genes-table-config',
  templateUrl: './genes-table-config.component.html',
  styleUrls: ['./genes-table-config.component.css']
})
export class GenesTableConfigComponent implements OnInit {

  genesTableFields = getAppConfig().getGeneResultsConfig().geneTableFields;

  selectedFieldNames: { [key: string]: boolean } = {};

  constructor(public bsModalRef: BsModalRef,
              private settingService: SettingsService,
              public deployConfigService: DeployConfigService) {
    settingService.visibleGenesTableFieldNames
      .map(fieldName => this.selectedFieldNames[fieldName] = true);
  }

  apply(): void {
    this.settingService.visibleGenesTableFieldNames = this.getSelectedFieldNames();
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

  private getSelectedFieldNames(): Array<string> {
    return Object.keys(this.selectedFieldNames).filter(name => this.selectedFieldNames[name]);
  }

  ngOnInit(): void {
  }
}
