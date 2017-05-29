import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-protein-properties',
  templateUrl: './protein-properties.component.html',
  styleUrls: ['./protein-properties.component.css']
})
export class ProteinPropertiesComponent implements OnInit {
  @Input() proteinDetails;

  propDisplayNames =
    { molecular_weight: 'Molecular weight',
      average_residue_weight: 'Average residue weight',
      charge_at_ph7: 'Charge at pH 7',
      isoelectric_point: 'Isoelectric point',
      codon_adaptation_index: 'Codon adaptation index',
    };

  propNames = Object.keys(this.propDisplayNames);

  constructor() { }

  ngOnInit() {
  }
}
