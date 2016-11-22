import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-genes-table',
  templateUrl: './genes-table.component.html',
  styleUrls: ['./genes-table.component.css']
})
export class GenesTableComponent {
  @Input() legend: string;
  @Input() genes: Array<any> = [];

  constructor() { }
}
