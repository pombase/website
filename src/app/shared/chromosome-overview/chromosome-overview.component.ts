import { Component, OnInit } from '@angular/core';

import { ChromosomeConfig, getAppConfig } from '../../config';
import { PombaseAPIService } from '../../pombase-api.service';

interface DisplayChromosome extends ChromosomeConfig {
  geneCount: number;
  length: number;
  enaId: string;
}

@Component({
  selector: 'app-chromosome-overview',
  templateUrl: './chromosome-overview.component.html',
  styleUrls: ['./chromosome-overview.component.css']
})
export class ChromosomeOverviewComponent implements OnInit {

  appConfig = getAppConfig();
  displayChromosomes: Array<DisplayChromosome> = [];
  longestChrLength = 0;

  constructor(private pombaseApiService: PombaseAPIService) { }

  chrBarWidth(chr: DisplayChromosome): number {
    return Math.trunc(200 * chr.length / this.longestChrLength + 1.0) / 10;
  }

  makeGenesLink(chr: DisplayChromosome): string {
    const json = `
{"constraints":{"node_name":"all genes from: ${chr.long_display_name}",
                "genome_range":{"chromosome_name":"${chr.name}"}},
 "output_options": {"field_names":["gene_uniquename"],"sequence":"none"}}`

    return `/results/from/json/${json}`;
  }

  ngOnInit(): void {
    this.displayChromosomes = [];

    this.pombaseApiService.getChromosomeSummaryMapPromise()
      .then(chrSummaryMap => {
        this.appConfig.chromosomes.map(chrConfig => {
          if (chrSummaryMap[chrConfig.name]) {
            const geneCount = chrSummaryMap[chrConfig.name].gene_count;
            const length = chrSummaryMap[chrConfig.name].length;
            const enaId = chrSummaryMap[chrConfig.name].ena_identifier;

            if (length > this.longestChrLength) {
              this.longestChrLength = length;
            }

            const displayConfig =
              Object.assign(
                {
                  geneCount,
                  length,
                  enaId,
                },
                chrConfig);
            this.displayChromosomes.push(displayConfig);
          }
        });
      });
  }
}
