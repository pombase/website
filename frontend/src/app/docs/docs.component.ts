import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-docs',
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.css']
})
export class DocsComponent implements OnInit {
  section: string = null;
  pageName: string = null;

  constructor(private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {
    this.section = this.route.snapshot.data['docsParent'];
    let parts = this.route.snapshot.url;

    this.route.url.forEach((parts) => {
      if (parts.length == 0) {
        this.pageName = 'index';
      } else {
        this.pageName = parts[0].toString();
      }
    })
  }
}
