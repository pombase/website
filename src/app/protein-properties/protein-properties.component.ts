import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { ProteinDetails } from '../pombase-api.service';

interface ProteinDisplayDetails {
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
  @Input() proteinDetails: ProteinDetails;

  proteinDisplayDetails?: ProteinDisplayDetails;

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

  getProteinDisplayDetails(propName: string): string {
    // FIXME: yuck
    return (this.proteinDisplayDetails as unknown as { [name: string]: string })[propName];
  }

  ngOnChanges() {
    this.proteinDisplayDetails = Object.assign({}, this.proteinDetails);

    let weight = this.proteinDetails.molecular_weight;
    this.proteinDisplayDetails.molecular_weight =
      Math.round(weight * 100) / 100.0 + ' kDa';

    let avg_weight = this.proteinDetails.average_residue_weight;
    this.proteinDisplayDetails.average_residue_weight =
      Math.round(avg_weight * 1000) + ' Da';

    this.proteinDisplayDetails.number_of_residues =
      this.proteinDetails.number_of_residues;
  }
}
