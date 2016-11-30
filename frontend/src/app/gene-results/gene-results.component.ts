import { Component, Input, OnInit } from '@angular/core';
import { PomBaseResults } from '../common/pombase-query';

@Component({
  selector: 'app-gene-results',
  templateUrl: './gene-results.component.html',
  styleUrls: ['./gene-results.component.css']
})
export class GeneResultsComponent implements OnInit {
  @Input() results: PomBaseResults;

  constructor() { }

  ngOnInit() {
  }
}
