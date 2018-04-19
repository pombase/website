import { Component, OnInit, OnChanges, Input } from '@angular/core';

import { Metadata, PombaseAPIService } from '../../pombase-api.service';

@Component({
  selector: 'app-cv-version',
  templateUrl: './cv-version.component.html',
  styleUrls: ['./cv-version.component.css']
})
export class CvVersionComponent implements OnInit, OnChanges {
  @Input() cvName: string;

  metadataPromise: Promise<Metadata> = null;
  version = null;

  constructor(private pombaseApiService: PombaseAPIService) { }

  ngOnInit() {
  }

  ngOnChanges() {
    this.version = null;
    if (this.metadataPromise == null) {
      this.metadataPromise = this.pombaseApiService.getMetadata();
    }
    this.metadataPromise.then(metadata => {
      const version = metadata.cv_versions[this.cvName];

      if (version) {
        this.version = version.replace(/^releases\/(.*)/, '$1')
          .replace(/^(\d\d):(\d\d):(\d\d\d\d)\s*.*/, '$3-$2-$1');
      }
    });
  }
}
