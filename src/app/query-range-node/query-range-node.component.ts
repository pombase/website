import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { QueryNodeConfig } from '../config';
import { FloatRangeNode, GeneQueryNode, IntRangeNode, NodeEventDetails } from '../pombase-query';

@Component({
  selector: 'app-query-range-node',
  templateUrl: './query-range-node.component.html',
  styleUrls: ['./query-range-node.component.css']
})
export class QueryRangeNodeComponent implements OnInit, OnChanges {
  @Input() nodeConfig: QueryNodeConfig;
  @Output() nodeEvent = new EventEmitter<NodeEventDetails>();

  enabledRangeSection: 'any'|'none'|'range' = 'any';
  rangeConstrainMin = true;
  rangeConstrainMax = false;
  rangeMin = 0;
  rangeStart = 0;
  rangeEnd = 0;

  constructor() { }


  initRange() {
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
        if (this.rangeConstrainMin) {
          newRangeStart = this.rangeStart;
        }
        if (this.rangeConstrainMax) {
          newRangeEnd = this.rangeEnd;
        }
      }
    }

    if (nodeConfig.nodeType == 'int-range') {
      part = new IntRangeNode(undefined, nodeConfig.id,
                              newRangeStart, newRangeEnd);
    } else {
      part = new FloatRangeNode(undefined, nodeConfig.id,
                                newRangeStart, newRangeEnd);
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
