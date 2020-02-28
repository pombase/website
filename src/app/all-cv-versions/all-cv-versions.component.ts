import { Component, OnInit } from '@angular/core';
import { PombaseAPIService, Metadata } from '../pombase-api.service';

@Component({
  selector: 'app-all-cv-versions',
  templateUrl: './all-cv-versions.component.html',
  styleUrls: ['./all-cv-versions.component.css']
})
export class AllCvVersionsComponent implements OnInit {
  metadata: Metadata;

  constructor(private pombaseApiService: PombaseAPIService) { }

  ngOnInit(): void {

    this.pombaseApiService.getMetadata()
      .then(metadata => {
        this.metadata = metadata;
      });
  }

}
