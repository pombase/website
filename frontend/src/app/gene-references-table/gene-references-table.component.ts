import { Component, Input, OnInit } from '@angular/core';
import { ReferenceShort } from '../pombase-api.service';

@Component({
  selector: 'app-gene-references-table',
  templateUrl: './gene-references-table.component.html',
  styleUrls: ['./gene-references-table.component.css']
})
export class GeneReferencesTableComponent implements OnInit {
  @Input() references: Array<ReferenceShort>;

  constructor() { }

  ngOnInit() {
  }
}
