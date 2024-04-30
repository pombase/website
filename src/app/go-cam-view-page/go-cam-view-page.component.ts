import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Params } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-go-cam-view-page',
  templateUrl: './go-cam-view-page.component.html',
  styleUrls: ['./go-cam-view-page.component.css']
})
export class GoCamViewPageComponent implements OnInit {

  sanitizedURL?: SafeResourceUrl;

  gocamId?: string;
  geneUniquename?: string;
  geneName?: string;

  constructor(private sanitizer: DomSanitizer,
              private route: ActivatedRoute) { }

  getIFrameURL(): SafeResourceUrl | undefined {
    return this.sanitizedURL;
  }

  ngOnInit(): void {
    this.route.params.forEach((params: Params) => {
      if (params['gocam_id'] !== undefined) {
        this.gocamId = params['gocam_id'];
        this.geneUniquename = params['gene_uniquename'];
        this.geneName = params['gene_name'];
        const rawUrl = 'gocam_viz/full/' + this.gocamId;
        this.sanitizedURL = this.sanitizer.bypassSecurityTrustResourceUrl(rawUrl);
      }
    });
  }
}
