import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/';
import { SettingsService } from '../settings.service';
import { GeneSummary } from '../pombase-api.service';

@Component({
  selector: 'app-genes-table-config',
  templateUrl: './genes-table-config.component.html',
  styleUrls: ['./genes-table-config.component.css']
})
export class GenesTableConfigComponent implements OnInit {

  fieldNames = GeneSummary.getDisplayFieldNames();

  selectedFields: { [key: string]: boolean } = {};

  constructor(public bsModalRef: BsModalRef,
              private settingService: SettingsService) {
    settingService.visibleGenesTableColumns
      .map(fieldName => this.selectedFields[fieldName] = true);
  }

  apply(): void {
    this.settingService.visibleGenesTableColumns = this.selectedFieldNames();
    this.bsModalRef.hide()
  }

  fieldChange(fieldName: string): void {
    const selectedFields = this.selectedFieldNames();

    if (selectedFields.length === 0) {
      if (fieldName === 'Systematic ID') {
        this.selectedFields['Gene name'] = true;
      } else {
        this.selectedFields['Systematic ID'] = true;
      }
    }
  }

  private selectedFieldNames(): Array<string> {
    return this.fieldNames.filter(name => this.selectedFields[name]);
  }

  ngOnInit(): void {
  }
}
