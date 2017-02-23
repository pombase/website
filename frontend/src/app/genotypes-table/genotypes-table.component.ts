import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-genotypes-table',
  templateUrl: './genotypes-table.component.html',
  styleUrls: ['./genotypes-table.component.css']
})
export class GenotypesTableComponent implements OnInit {
  @Input() legend: string;
  @Input() genotypes: Array<any> = [];

  constructor() { }

  ngOnInit() {

    console.log(this.genotypes);

  }

}
