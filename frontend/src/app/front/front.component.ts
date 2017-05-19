import { Component, OnInit, Input } from '@angular/core';

import { Metadata, PombaseAPIService } from '../pombase-api.service';

@Component({
  selector: 'app-front',
  templateUrl: './front.component.html',
  styleUrls: ['./front.component.css']
})
export class FrontComponent implements OnInit {
  @Input() metadata: Metadata;

  imageNames = ['Slide1.png', 'Slide2.png', 'Slide3.png'];
  rightImageName = this.imageNames[0];
  recentCommunityCurationPubs = null;

  constructor(private pombaseApiService: PombaseAPIService) { }

  ngOnInit() {
    this.rightImageName = this.imageNames[Math.floor(Math.random() * this.imageNames.length)];
    this.pombaseApiService.getMetadata()
      .then(metadata => {
        this.metadata = metadata;
      });
    this.pombaseApiService.getRecentReferences()
      .then(recentReferences => {
        this.recentCommunityCurationPubs = recentReferences.community_curated.splice(0, 8);
      });
  }
}
