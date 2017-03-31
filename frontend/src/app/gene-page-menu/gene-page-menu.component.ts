import { Component, OnInit, Input, OnChanges,
         Inject } from '@angular/core';

import { GeneDetails } from '../pombase-api.service';
import { getAnnotationTableConfig, AnnotationTableConfig} from '../config';

interface MenuItem {
  id: string;
  displayName: string;
}

@Component({
  selector: 'app-gene-page-menu',
  templateUrl: './gene-page-menu.component.html',
  styleUrls: ['./gene-page-menu.component.css']
})
export class GenePageMenuComponent implements OnInit, OnChanges {
  @Input() geneDetails: GeneDetails;
  @Input() visibleSections: Array<string> = [];

  menuItems: Array<MenuItem> = [];
  config: AnnotationTableConfig = getAnnotationTableConfig();

  scrollToPageTop(): void {
    this.window.scrollTo(0, 0);
  }

  constructor(@Inject('Window') private window: any) { }

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.visibleSections) {
      this.menuItems =
        this.visibleSections.map(typeName => {
          let typeConfig = this.config.getAnnotationType(typeName);
          return {
            id: typeName,
            displayName: typeConfig.display_name || typeName,
          };
        });
    } else {
      this.menuItems = [];
    }
  }
}
