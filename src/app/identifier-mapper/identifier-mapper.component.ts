import { Component, OnInit } from '@angular/core';

import { IdentifierMapperService, MapperType } from '../identifier-mapper.service';
import { AppConfig, getAppConfig } from '../config';
import { Router } from '@angular/router';

@Component({
  selector: 'app-identifier-mapper',
  templateUrl: './identifier-mapper.component.html',
  styleUrls: ['./identifier-mapper.component.css']
})
export class IdentifierMapperComponent implements OnInit {

  appConfig: AppConfig = getAppConfig();

  organismCommonName = this.appConfig.getConfigOrganism().common_name;

  constructor(private router: Router,
              public identifierMapperService: IdentifierMapperService) {
  }

  mapperTypes(): Array<MapperType> {
    return this.identifierMapperService.mapperTypes();
  }

  filteredIds(): Array<string> {
    return this.identifierMapperService.filteredIds();
  }

  mapperTypeCompare(a: MapperType, b: MapperType): boolean {
    if (!a || !b) {
      return false;
    }
    return a.id === b.id;
  }

  objectKeyCount(obj: {}): number {
    return Object.keys(obj).length;
  }

  readFile($event: Event): void {
    let inputValue = $event.target as any;
    let file = inputValue.files[0];

    if (!file) {
      return;
    }

    let fileReader = new FileReader();

    fileReader.onloadend = () => {
      this.identifierMapperService.inputText = fileReader.result as string;
    };

    fileReader.readAsText(file);
  }

  clear(): void {
    this.identifierMapperService.inputText = '';
    this.identifierMapperService.resetResults();
  }

  inputTextChanged(inputText: string): void {
    this.identifierMapperService.inputText = inputText;
  }

  lookup(): void {
    this.identifierMapperService.lookup()
      .then(() => {
        this.router.navigate(['/identifier-mapper-results']);
      }) 
  }

  ngOnInit(): void {
  }

}
