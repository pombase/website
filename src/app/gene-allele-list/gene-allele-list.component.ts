import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { AlleleShort } from '../pombase-api.service';

class DisplayAllele {
  displayName: string;
  constructor(public uniquename: string,
              public name: string,
              public description: string,
              public alleleType: string) {
    this.displayName = this.name.replace(/,/g, ',&#8203;');
    this.description = this.description.replace(/,/g, ',&#8203;');
  }

  nameDescription(): string {
    return (this.name || 'unknown') + '(' + (this.name || 'unknown') + ')';
  }
}

@Component({
  selector: 'app-gene-allele-list',
  templateUrl: './gene-allele-list.component.html',
  styleUrls: ['./gene-allele-list.component.css']
})
export class GeneAlleleListComponent implements OnChanges {
  @Input() alleles: Array<AlleleShort>;

  displayAlleles: Array<DisplayAllele> = [];

  sortByColumnName: string = 'type';

  constructor() { }

  sortBy(columnName: 'name'|'description'|'type'): void {
    this.sortByColumnName = columnName;

    this.makeTable();
  }

  makeTable(): void {
    this.displayAlleles =
      this.alleles.map(a => {
        return new DisplayAllele(a.uniquename, a.name, a.description, a.allele_type);
      });

    if (this.sortByColumnName == 'type') {
      this.displayAlleles.sort((a, b) => {
        if (a.alleleType === b.alleleType) {
          return a.nameDescription().localeCompare(b.nameDescription());
        } else {
          return a.alleleType.localeCompare(b.alleleType);
        }
      });
    } else {
      this.displayAlleles.sort((a, b) => {
        let result;

        if (this.sortByColumnName === 'name') {
          result = a.name.localeCompare(b.name);
        } else {
          if (a.description.length == 0 && b.description.length == 0) {
            result = 0;
          } else {
            if (a.description.length == 0) {
              // missing / blank description sort last
              result = 1;
            } else {
              if (b.description.length == 0) {
                return -1
              } else {
                result = a.description.localeCompare(b.description);
              }
            }
          }
        }

        if (result === 0) {
          result = a.alleleType.localeCompare(b.alleleType);
        }

        return result;
      })
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.makeTable();
  }
}
