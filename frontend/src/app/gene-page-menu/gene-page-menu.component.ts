import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

import { GeneDetails } from '../pombase-api.service';
import { getAnnotationTableConfig, AnnotationTableConfig} from '../config';

interface MenuItem {
  id: string,
  displayName: string,
}

@Component({
  selector: 'app-gene-page-menu',
  templateUrl: './gene-page-menu.component.html',
  styleUrls: ['./gene-page-menu.component.css']
})
export class GenePageMenuComponent implements OnInit, OnChanges {
  @Input() geneDetails: GeneDetails;

  annotationTypeNames: Array<string> = [];
  menuItems: Array<MenuItem> = [];
  config: AnnotationTableConfig = getAnnotationTableConfig();

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
    this.annotationTypeNames = this.config.annotationTypeOrder;
    if (this.geneDetails) {
      this.menuItems =
        this.annotationTypeNames.map(typeName => {
          let typeConfig = this.config.getAnnotationType(typeName);
          return {
            id: typeName,
            displayName: typeConfig.displayName || typeName,
          }
        });
    }
  }
}
