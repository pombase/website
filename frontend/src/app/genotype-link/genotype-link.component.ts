import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-genotype-link',
  templateUrl: './genotype-link.component.html',
  styleUrls: ['./genotype-link.component.css']
})
export class GenotypeLinkComponent implements OnInit {
  @Input() genotype: /* GenotypeShort */ any;

  constructor() { }

  ngOnInit() {
  }
}
