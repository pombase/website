import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { GeneDetails } from '../pombase-api.service';

interface ProteinDisplayDetails {
  transcript_uniquename: string;
  average_residue_weight: number | string;
  number_of_residues: number;
  molecular_weight: number | string;
}

@Component({
  selector: 'app-protein-properties',
  templateUrl: './protein-properties.component.html',
  styleUrls: ['./protein-properties.component.css']
})
export class ProteinPropertiesComponent implements OnInit, OnChanges {
  @Input() geneDetails: GeneDetails;

  proteinDisplayDetails: Array<ProteinDisplayDetails> = [];

  propDisplayNames =
    { molecular_weight: 'Molecular weight',
      number_of_residues: 'Number of residues',
      average_residue_weight: 'Average residue weight',
      charge_at_ph7: 'Charge at pH 7',
      isoelectric_point: 'Isoelectric point',
    };

  propNames = Object.keys(this.propDisplayNames);

  constructor() { }

  ngOnInit() {
  }

  getPropDisplayName(propName: string): string {
    return (this.propDisplayNames as { [name: string]: string })[propName];
  }

  getProteinDisplayDetails(proteinDisplayDetails: ProteinDisplayDetails, propName: string): string {
    // FIXME: yuck
    return (proteinDisplayDetails as unknown as { [name: string]: string })[propName];
  }

  ngOnChanges() {
    this.proteinDisplayDetails = [];
    for (const transcript of this.geneDetails.transcripts) {
      if (transcript.protein) {
        const protein = transcript.protein;
        let proteinDisplayDetails: ProteinDisplayDetails =
            Object.assign({ transcript_uniquename: transcript.uniquename }, protein);

        const weight = protein.molecular_weight;
        proteinDisplayDetails.molecular_weight =
          Math.round(weight * 100) / 100.0 + ' kDa';

        const avg_weight = protein.average_residue_weight;
        proteinDisplayDetails.average_residue_weight =
          Math.round(avg_weight * 1000) + ' Da';

        proteinDisplayDetails.number_of_residues =
          protein.number_of_residues;

        this.proteinDisplayDetails.push(proteinDisplayDetails);
      }
    }
  }
}
