import { Component, OnInit, Inject } from '@angular/core';

import { Router, ActivatedRoute, NavigationStart } from '@angular/router';

const urlRe = new RegExp('/([^/]+)(?:/([^/]+))?');

@Component({
  selector: 'app-docs',
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.css']
})
export class DocsComponent implements OnInit {
  section: string = null;
  pageName: string = null;
  subscription = null;

  constructor(private route: ActivatedRoute,
              private router: Router,
              @Inject('Window') private window: any
             ) {
    this.subscription = router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.setSectPage(event.url);
      }
    });
  }

  navigate($event: MouseEvent, route: string) {
    // nagivate on when header is clicked
    if ($event.srcElement.localName.match(/^h\d$/i)) {
      this.router.navigate([route]);
    }
  }

  setSectPage(url: string) {
    const urlMatch = urlRe.exec(url);
    if (urlMatch) {
      this.section = urlMatch[1];
      if (urlMatch[2]) {
        this.pageName = urlMatch[2];
      } else {
        this.pageName = 'index';
      }
    }
  }

  scrollToPageTop(): void {
    this.window.scrollTo(0, 0);
  }

  ngOnInit(): void {
    this.scrollToPageTop();
    this.setSectPage(this.router.url);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
