import { Component, OnInit, Input, OnChanges,
         Inject } from '@angular/core';

import { TermDetails } from '../pombase-api.service';
import { getAnnotationTableConfig, AnnotationTableConfig} from '../config';

interface MenuItem {
  id: string;
  displayName: string;
}

@Component({
  selector: 'app-term-page-menu',
  templateUrl: './term-page-menu.component.html',
  styleUrls: ['./term-page-menu.component.css']
})
export class TermPageMenuComponent implements OnInit, OnChanges {
  @Input() termDetails: TermDetails;
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
