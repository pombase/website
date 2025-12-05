import { Component, OnInit } from '@angular/core';
import { PombaseAPIService, Metadata } from '../../pombase-api.service';
import { getAppConfig } from '../../config';

class OntologyDetail {
  cvName: string;
  description: string;
  externalLink?: string;
  version: string;
}

@Component({
  selector: 'app-dataset-versions',
  templateUrl: './dataset-versions.component.html',
  styleUrl: './dataset-versions.component.css',
  standalone: false
})
export class DatasetVersionsComponent implements OnInit {
  metadata: Metadata;
  dataSourceNameVersions: Array<[string, string]> = [];

  cvDetails: Array<OntologyDetail> = [];

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

        const ontologyDetails = getAppConfig().datasetVersions.ontology_details;

        for (const cvName of Object.keys(metadata.cv_versions)) {
          if (ontologyDetails[cvName]) {
            const datasetOntologyDetail = ontologyDetails[cvName];
            const cvVersion = metadata.cv_versions[cvName];
            this.cvDetails.push({
              cvName,
              description: datasetOntologyDetail.description,
              externalLink: datasetOntologyDetail.external_link,
              version: cvVersion,
            });
          }
        }

        this.cvDetails.sort((a,b) => a.cvName.localeCompare(b.cvName));
      });
  }
}
