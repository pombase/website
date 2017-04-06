import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-docs',
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.css']
})
export class DocsComponent implements OnInit {
  docpath: string = null;
  menupath: string = null;

  constructor(private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {
    let docsParent = this.route.snapshot.data['docsParent'];
    let parts = this.route.snapshot.url;

    let prefix = 'docs/' + docsParent;
    if (parts.length == 0) {
      this.docpath = prefix + '.md';
      this.menupath = prefix + '/menu.md';
    } else {
      this.docpath = prefix + '/' + parts.join('/') + '.md';
      this.menupath = prefix + parts.slice(0, -1).join('/') + '/menu.md';
    }
  }
}
