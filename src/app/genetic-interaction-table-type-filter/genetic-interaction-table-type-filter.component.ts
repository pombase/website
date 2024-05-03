import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';

import { GeneticInteractionGroup } from '../pombase-api.service';
import { FilterConfig, InteractionTypeFilterCategory } from '../config';
import { GeneticInteractionTypeFilter } from '../filtering/genetic-interaction-type-filter';
import { Filter } from '../filtering';

class SelectData {
  constructor(public interactionType: string,
              // set to true iff there is annotation in the table that has this
              // type
              public active: boolean) { }
}

@Component({
  selector: 'app-genetic-interaction-table-type-filter',
  templateUrl: './genetic-interaction-table-type-filter.component.html',
  styleUrls: ['./genetic-interaction-table-type-filter.component.css']
})
export class GeneticInteractionTableTypeFilterComponent implements OnInit, OnChanges {
  @Input() interactionTable: Array<GeneticInteractionGroup>;
  @Input() config: FilterConfig;
  @Output() filterChange = new EventEmitter<Filter<Array<GeneticInteractionGroup>>>();

  selectedType: any = null;

  choiceData: Array<SelectData> = [];
  reset(): void {
    this.selectedType = null;
    this.setType(undefined);
  }

  setType(event?: SelectData): void {
    if (event) {
      this.filterChange.emit(new GeneticInteractionTypeFilter(event.interactionType));
    } else {
      this.filterChange.emit(undefined);
    }
  }

  constructor() { }

  ngOnInit(): void { }

  ngOnChanges() {
    this.selectedType = null;

    this.choiceData = [];

    let seenType: { [key: InteractionTypeFilterCategory]: boolean } = {};

    for (let interaction of this.interactionTable) {
      seenType[interaction.interaction_type] = true;
    }

    if (this.config.interaction_types) {
      for (let interaction_type of this.config.interaction_types) {
        let active = seenType[interaction_type];

        let selectData = new SelectData(interaction_type, active);

        this.choiceData.push(selectData);
      }
    }
  }
}
