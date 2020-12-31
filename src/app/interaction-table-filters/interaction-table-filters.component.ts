import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { InteractionAnnotation, InteractionTable } from '../pombase-api.service';
import { FilterConfig } from '../config';
import { InteractionFilter, FilterCombiner } from '../filtering';

@Component({
  selector: 'app-interaction-table-filters',
  templateUrl: './interaction-table-filters.component.html',
  styleUrls: ['./interaction-table-filters.component.css']
})
export class InteractionTableFiltersComponent implements OnInit {
  @Input() interactionTable: Array<InteractionAnnotation>;
  @Input() filters: Array<FilterConfig>;
  @Output() filterChange = new EventEmitter<InteractionFilter>();

  currentFilters: { [key: string]: InteractionFilter } = {};

  filterChanged(filterType: string, event: InteractionFilter) {
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
      this.filterChange.emit(null);
    } else {
      this.filterChange.emit(new FilterCombiner<InteractionTable>(eventsToEmit));
    }
  }

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
  }
}
