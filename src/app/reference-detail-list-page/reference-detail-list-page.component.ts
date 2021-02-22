import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-reference-detail-list-page',
  templateUrl: './reference-detail-list-page.component.html',
  styleUrls: ['./reference-detail-list-page.component.css']
})
export class ReferenceDetailListPageComponent implements OnInit {
  constraint: string|undefined;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      this.constraint = params['constraint'];
    });
  }
}
