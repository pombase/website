import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-gene-neighbourhood',
  templateUrl: './gene-neighbourhood.component.html',
  styleUrls: ['./gene-neighbourhood.component.css']
})
export class GeneNeighbourhoodComponent implements OnInit {
  @Input() focusGeneUniquename;
  @Input() focusGeneName;
  @Input() neighbourhood;

  constructor() { }

  ngOnInit() {
  }
}
