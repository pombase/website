import { Component, OnInit } from '@angular/core';

import { PombaseAPIService } from '../pombase-api.service';


@Component({
  selector: 'app-recent-community-pubs',
  templateUrl: './recent-community-pubs.component.html',
  styleUrls: ['./recent-community-pubs.component.css']
})
export class RecentCommunityPubsComponent implements OnInit {
  recentCommunityCurationPubs = null;

  constructor(private pombaseApiService: PombaseAPIService) { }

  ngOnInit() {
    this.pombaseApiService.getRecentReferences()
      .then(recentReferences => {
        this.recentCommunityCurationPubs = recentReferences.community_curated.splice(0, 4);
      });
  }
}
