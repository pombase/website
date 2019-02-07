import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-reference-detail-list-page',
  templateUrl: './reference-detail-list-page.component.html',
  styleUrls: ['./reference-detail-list-page.component.css']
})
export class ReferenceDetailListPageComponent implements OnInit {
  constraint: string = null;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      if (params['constraint'] === undefined) {
        this.constraint = null;
      } else {
        this.constraint = params['constraint'];
      }
    });
  }
}
