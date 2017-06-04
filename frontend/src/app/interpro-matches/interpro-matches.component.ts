import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-interpro-matches',
  templateUrl: './interpro-matches.component.html',
  styleUrls: ['./interpro-matches.component.css']
})
export class InterproMatchesComponent implements OnInit {
  @Input() geneDisplayName;
  @Input() uniprotIdentifier = null;
  @Input() matches = null;

  constructor() { }

  ngOnInit() {
  }
}
