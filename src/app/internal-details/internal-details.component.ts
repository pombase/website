import { Component, OnInit } from '@angular/core';
import { PombaseAPIService, Metadata } from '../pombase-api.service';

@Component({
    selector: 'app-internal-details',
    templateUrl: './internal-details.component.html',
    styleUrls: ['./internal-details.component.css'],
    standalone: false
})
export class InternalDetailsComponent implements OnInit {
  metadata: Metadata;
  dataSourceNameVersions: Array<[string, string]> = [];

  constructor(private pombaseApiService: PombaseAPIService) { }

  ngOnInit(): void {
    this.pombaseApiService.getMetadata()
      .then(metadata => {
        this.metadata = metadata;

        let dataSourceNames = Object.keys(metadata.data_source_versions);

        dataSourceNames.sort((n1, n2) => {
          return n1.localeCompare(n2);
        });

        for (const name of dataSourceNames) {
          const version = metadata.data_source_versions[name];
          this.dataSourceNameVersions.push([name, version]);
        }
      });
  }

}
