import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-front-panel-content',
  templateUrl: './front-panel-content.component.html',
  styleUrls: ['./front-panel-content.component.css']
})
export class FrontPanelContentComponent implements OnInit {
  @Input() panelId;

  constructor() { }

  ngOnInit() {
  }
}
