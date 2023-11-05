import { Component } from '@angular/core';

@Component({
  selector: 'app-curation-stats',
  templateUrl: './curation-stats.component.html',
  styleUrls: ['./curation-stats.component.css']
})
export class CurationStatsComponent {
  cumulativeByYearPlotLoaded = false;
  curatedByYearPlotLoaded = false;
  curatableByYearPlotLoaded = false;
}
