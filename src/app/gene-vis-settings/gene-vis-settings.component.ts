import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/';
import { getAppConfig } from '../config';
import { TermShort } from '../pombase-query';
import { SettingsService } from '../settings.service';

@Component({
  selector: 'app-gene-vis-settings',
  templateUrl: './gene-vis-settings.component.html',
  styleUrls: ['./gene-vis-settings.component.css']
})
export class GeneVisSettingsComponent implements OnInit {
  appConfig = getAppConfig();

  selectedTerm?: TermShort;

  visCvNames =
    this.appConfig.getGeneResultsConfig().visualisation_extra_column_cv_names;


  cvNamesForTermComplete = '(' + this.visCvNames.join(' OR ') + ')';

  extraColumns: Array<string> = [];

  constructor(public bsModalRef: BsModalRef,
    private settingsService: SettingsService) { }

  termMatched(term: TermShort) {
    this.selectedTerm = term;
  }

  clearSelection() {
    this.selectedTerm = undefined;
  }

  apply() {
    if (this.selectedTerm) {
      this.settingsService.addExtraGeneVisColumns([this.selectedTerm]);
    }
    this.bsModalRef.hide();
  }

  ngOnInit(): void {

  }

}
