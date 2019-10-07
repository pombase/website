import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-motif-search-help',
  templateUrl: './motif-search-help.component.html',
  styleUrls: ['./motif-search-help.component.css']
})
export class MotifSearchHelpComponent implements OnInit {
  @Input() full = true;

  constructor() { }

  ngOnInit() {
  }
}
