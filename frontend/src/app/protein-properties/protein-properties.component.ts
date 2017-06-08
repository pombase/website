import { Component, OnInit, OnChanges, Input } from '@angular/core';

@Component({
  selector: 'app-protein-properties',
  templateUrl: './protein-properties.component.html',
  styleUrls: ['./protein-properties.component.css']
})
export class ProteinPropertiesComponent implements OnInit, OnChanges {
  @Input() proteinDetails;

  proteinDisplayDetails = null;

  propDisplayNames =
    { molecular_weight: 'Molecular weight',
      number_of_residues: 'Number of residues',
      average_residue_weight: 'Average residue weight',
      charge_at_ph7: 'Charge at pH 7',
      isoelectric_point: 'Isoelectric point',
      codon_adaptation_index: 'Codon adaptation index',
    };

  propNames = Object.keys(this.propDisplayNames);

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
    this.proteinDisplayDetails = Object.assign({}, this.proteinDetails);

    let weight = this.proteinDisplayDetails['molecular_weight'];

    this.proteinDisplayDetails['molecular_weight'] =
      Math.round(weight / 10.0) / 100 + ' kDa';

    this.proteinDisplayDetails['number_of_residues'] =
      this.proteinDetails.number_of_residues;
  }
}
