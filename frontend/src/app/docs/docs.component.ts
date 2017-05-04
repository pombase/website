import { Component, OnInit, Inject } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-docs',
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.css']
})
export class DocsComponent implements OnInit {
  section: string = null;
  pageName: string = null;

  constructor(private route: ActivatedRoute,
              private router: Router,
              @Inject('Window') private window: any
             ) { }

  scrollToPageTop(): void {
    this.window.scrollTo(0, 0);
  }

  ngOnInit(): void {
    this.scrollToPageTop();

    this.section = this.route.snapshot.data['docsParent'];

    this.route.url.forEach((parts) => {
      if (parts.length === 0) {
        this.pageName = 'index';
      } else {
        this.pageName = parts[0].toString();
      }
    });
  }
}
