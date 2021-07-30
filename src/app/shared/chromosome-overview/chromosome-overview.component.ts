import { Component, OnInit } from '@angular/core';

import { ChromosomeConfig, getXrfWithPrefix, getAppConfig } from '../../config';
import { PombaseAPIService } from '../../pombase-api.service';

interface DisplayChromosome extends ChromosomeConfig {
  displayName: string;
  geneCount: number;
  length: number;
  enaId: string;
  enaUrl: string|undefined;
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
            const chr = chrSummaryMap[chrConfig.name];
            const name = chr.name;
            const geneCount = chr.gene_count;
            const length = chr.length;
            const enaId = chr.ena_identifier;

            if (length > this.longestChrLength) {
              this.longestChrLength = length;
            }

            let enaUrl = undefined;
            let enaXrfConfig = getXrfWithPrefix('ENA', enaId);

            if (enaXrfConfig) {
              enaUrl = enaXrfConfig.url;
            }

            let displayName;

            if (chrConfig.short_display_name.toLocaleLowerCase() === name.toLocaleLowerCase() ||
                this.appConfig.site_name === 'PomBase') {
              displayName = chrConfig.short_display_name;
            } else {
              displayName = `${chrConfig.short_display_name} (${name})`;
            }

            const displayConfig =
              Object.assign(
                {
                  displayName,
                  geneCount,
                  length,
                  enaId,
                  enaUrl,
                },
                chrConfig);

            this.displayChromosomes.push(displayConfig);
          }
        });
      });
  }
}
