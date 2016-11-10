import { Component, OnInit, Input } from '@angular/core';

import { Metadata, PombaseAPIService } from '../pombase-api.service';

@Component({
  selector: 'app-front',
  templateUrl: './front.component.html',
  styleUrls: ['./front.component.css']
})
export class FrontComponent implements OnInit {
  @Input() metadata: Metadata;

  constructor(private pombaseApiService: PombaseAPIService) { }

  ngOnInit() {
    this.pombaseApiService.getMetadata()
      .then(metadata => {
        this.metadata = metadata;
      });
  }
}
