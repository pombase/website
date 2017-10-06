import { Component, OnInit, Input } from '@angular/core';

import { Metadata, PombaseAPIService } from '../pombase-api.service';

import { getAppConfig } from '../config';

function randInt(upperBound: number): number {
  return Math.floor(Math.random() * upperBound);
}

function randElement<T>(arr: Array<T>): T {
  return arr[randInt(arr.length)];
}

@Component({
  selector: 'app-front',
  templateUrl: './front.component.html',
  styleUrls: ['./front.component.css']
})
export class FrontComponent implements OnInit {
  @Input() metadata: Metadata;

  imageNames = ['Slide1.png', 'Slide2.png', 'Slide3.png'];
  rotatingImageName = this.imageNames[0];
  recentCommunityCurationPubs = null;
  spotlightPanelConfig =
    getAppConfig().frontPagePanels.filter(conf =>
      conf.panel_type === 'spotlight'
    );
  explorePanelConfig =
    getAppConfig().frontPagePanels.filter(conf =>
      conf.panel_type === 'explore'
    );

  spotlightConf = null;
  exploreConf = null;

  constructor(private pombaseApiService: PombaseAPIService) { }

  ngOnInit() {
    this.rotatingImageName = randElement(this.imageNames);
    this.spotlightConf = randElement(this.spotlightPanelConfig);
    this.exploreConf = randElement(this.explorePanelConfig);

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
