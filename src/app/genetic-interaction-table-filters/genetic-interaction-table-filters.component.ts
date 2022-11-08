import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { GeneticInteractionTable, GeneticInteractionGroup } from '../pombase-api.service';
import { FilterConfig } from '../config';
import { FilterCombiner, GeneticInteractionFilter } from '../filtering';

@Component({
  selector: 'app-genetic-interaction-table-filters',
  templateUrl: './genetic-interaction-table-filters.component.html',
  styleUrls: ['./genetic-interaction-table-filters.component.css']
})
export class GeneticInteractionTableFiltersComponent implements OnInit {
  @Input() interactionTable: Array<GeneticInteractionGroup>;
  @Input() filters: Array<FilterConfig>;
  @Output() filterChange = new EventEmitter<GeneticInteractionFilter>();

  currentFilters: { [key: string]: GeneticInteractionFilter } = {};

  filterChanged(filterType: string, event: GeneticInteractionFilter) {
    if (event) {
      this.currentFilters[filterType] = event;
    } else {
      delete this.currentFilters[filterType];
    }

    let eventsToEmit = [];

    for (let filterName of Object.keys(this.currentFilters)) {
      eventsToEmit.push(this.currentFilters[filterName]);
    }

    if (eventsToEmit.length === 0) {
      this.filterChange.emit(undefined);
    } else {
      this.filterChange.emit(new FilterCombiner<GeneticInteractionTable>(eventsToEmit));
    }
  }

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
  }
}
