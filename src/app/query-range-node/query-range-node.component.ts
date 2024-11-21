import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { QueryNodeConfig } from '../config';
import { FloatRangeNode, GeneQueryNode, IntRangeNode, NodeEventDetails } from '../pombase-query';

@Component({
    selector: 'app-query-range-node',
    templateUrl: './query-range-node.component.html',
    styleUrls: ['./query-range-node.component.css'],
    standalone: false
})
export class QueryRangeNodeComponent implements OnInit, OnChanges {
  @Input() nodeConfig: QueryNodeConfig;
  @Output() nodeEvent = new EventEmitter<NodeEventDetails>();

  enabledRangeSection: 'any'|'none'|'percent-range'|'range' = 'any';
  rangeConstrainMin = true;
  rangeConstrainMax = false;
  rangeMin = 0;
  rangeStart = 0;
  rangeEnd = 0;

  percentRangeConstrainMin = true;
  percentRangeConstrainMax = false;
  percentRangeMin = 0;
  percentRangeStart = 1;
  percentRangeEnd = 100;

  percentDisplayName?: string = undefined;

  showPercentRange = false;

  rangeOption?: string;

  constructor() { }

  initRange() {
    this.percentDisplayName = this.nodeConfig.percent_display_name;

    if (this.nodeConfig.nodeType == 'int-range' || this.nodeConfig.nodeType == 'float-range') {
      if (this.nodeConfig.range_minimum === undefined) {
        this.rangeMin = 0;
      } else {
        this.rangeMin = this.nodeConfig.range_minimum;
      }

      this.rangeStart = this.rangeMin;
      this.rangeEnd = this.rangeMin;

      if (!this.nodeConfig.range_any_and_none) {
        this.enabledRangeSection = 'range';
      }
      if (this.nodeConfig.percent_query_id) {
        this.showPercentRange = true;
      }
    }

    if (this.nodeConfig.node_options) {
      this.rangeOption = this.nodeConfig.node_options[0].id;
    }
  }

  rangeMinToggled() {
    if (!this.rangeConstrainMin) {
      this.rangeConstrainMax = true;
    }
  }

  rangeMaxToggled() {
    if (!this.rangeConstrainMax) {
      this.rangeConstrainMin = true;
    }
  }

  rangeStartChanged() {
    if (this.rangeStart === null) {
      // user has deleted the number
      this.rangeStart = this.rangeEnd;
    } else {
      if (this.rangeStart > this.rangeEnd) {
        this.rangeEnd = this.rangeStart;
      }
    }
  }

  rangeEndChanged() {
    if (this.rangeEnd === null) {
      // user has deleted the number
      this.rangeEnd = this.rangeStart;
    } else {
      if (this.rangeStart > this.rangeEnd) {
        this.rangeStart = this.rangeEnd;
      }
    }
  }


  percentRangeMinToggled() {
    if (!this.percentRangeConstrainMin) {
      this.percentRangeConstrainMax = true;
    }
  }

  percentRangeMaxToggled() {
    if (!this.percentRangeConstrainMax) {
      this.percentRangeConstrainMin = true;
    }
  }

  percentRangeStartChanged() {
    if (this.percentRangeStart === null) {
      // user has deleted the number
      this.percentRangeStart = this.percentRangeEnd;
    } else {
      if (this.percentRangeStart > this.percentRangeEnd) {
        this.percentRangeEnd = this.percentRangeStart;
      }
    }
  }

  percentRangeEndChanged() {
    if (this.rangeEnd === null) {
      // user has deleted the number
      this.percentRangeEnd = this.percentRangeStart;
    } else {
      if (this.percentRangeStart > this.percentRangeEnd) {
        this.percentRangeStart = this.percentRangeEnd;
      }
    }
  }


  emitNodeEvent(node: GeneQueryNode): void {
    this.nodeEvent.emit({ node, nodeConf: this.nodeConfig });
  }

  rangeSearch(nodeConfig: QueryNodeConfig): void {
    let part;

    let newRangeStart = undefined;
    let newRangeEnd = undefined;

    if (this.enabledRangeSection === 'any') {
      newRangeStart = 1;
    } else {
      if (this.enabledRangeSection === 'none') {
        newRangeStart = 0;
        newRangeEnd = 0;
      } else {
        if (this.enabledRangeSection == 'percent-range') {
          if (this.percentRangeConstrainMin) {
            newRangeStart = this.percentRangeStart;
          }
          if (this.percentRangeConstrainMax) {
            newRangeEnd = this.percentRangeEnd;
          }
        } else {
          if (this.rangeConstrainMin) {
            newRangeStart = this.rangeStart;
          }
          if (this.rangeConstrainMax) {
            newRangeEnd = this.rangeEnd;
          }
        }
      }
    }

    let options: Array<string> = [];

    if (this.rangeOption) {
      options = [this.rangeOption];
    }

    if (nodeConfig.nodeType == 'int-range') {
      let nodeId = nodeConfig.id;

      if (this.enabledRangeSection == 'percent-range' && nodeConfig.percent_query_id) {
        nodeId = nodeConfig.percent_query_id;
      }

      part = new IntRangeNode(undefined, nodeId,
                              newRangeStart, newRangeEnd, options);
    } else {
      part = new FloatRangeNode(undefined, nodeConfig.id,
                                newRangeStart, newRangeEnd, options);
    }
    this.emitNodeEvent(part);
  }

  ngOnInit(): void {
    this.initRange();
  }

  ngOnChanges(): void {
    this.initRange();
  }
}
