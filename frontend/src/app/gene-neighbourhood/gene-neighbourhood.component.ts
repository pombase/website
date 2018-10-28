import { Component, OnInit, Input } from '@angular/core';
import { GeneShort } from '../pombase-api.service';

@Component({
  selector: 'app-gene-neighbourhood',
  templateUrl: './gene-neighbourhood.component.html',
  styleUrls: ['./gene-neighbourhood.component.css']
})
export class GeneNeighbourhoodComponent implements OnInit {
  @Input() focusGeneUniquename: string;
  @Input() focusGeneName: string;
  @Input() neighbourhood: Array<GeneShort>;

  constructor() { }

  ngOnInit() {
  }
}
