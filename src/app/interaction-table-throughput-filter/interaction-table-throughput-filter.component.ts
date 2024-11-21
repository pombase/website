import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';

import { InteractionTable, ThroughputType } from '../pombase-api.service';
import { FilterConfig } from '../config';
import { InteractionThroughputFilter } from '../filtering/interaction-throughput-filter';
import { Filter } from '../filtering';

class SelectData {
  constructor(public displayName: string,
              // set to true iff there is annotation in the table that has this
              // throughput
              public active: boolean,
              public throughput: ThroughputType) { }
}


@Component({
    selector: 'app-interaction-table-throughput-filter',
    templateUrl: './interaction-table-throughput-filter.component.html',
    styleUrls: ['./interaction-table-throughput-filter.component.css'],
    standalone: false
})
export class InteractionTableThroughputFilterComponent implements OnInit, OnChanges {
  @Input() interactionTable: InteractionTable;
  @Input() config: FilterConfig;
  @Output() filterChange = new EventEmitter<Filter<InteractionTable>>();

  selectedCategory: any = null;

  choiceData: Array<SelectData> = [];
  reset(): void {
    this.selectedCategory = null;
    this.setCategory(undefined);
  }

  setCategory(event?: SelectData): void {
    if (event) {
      this.filterChange.emit(new InteractionThroughputFilter(event.throughput));
    } else {
      this.filterChange.emit(undefined);
    }
  }


  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
    this.selectedCategory = null;

    this.choiceData = [];

    let seenThroughput: { [key: string]: boolean } = {};

    for (let interaction of this.interactionTable) {
      seenThroughput[interaction.throughput] = true;
    }

    if (this.config.throughput_categories) {
      for (let category of this.config.throughput_categories) {
        let active = seenThroughput[category.throughput_type];

        let selectData = new SelectData(category.display_name,
          active, category.throughput_type);

        this.choiceData.push(selectData);
      }
    }
  }
}
