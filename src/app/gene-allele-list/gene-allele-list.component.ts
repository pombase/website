import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { AlleleShort } from '../pombase-api.service';

@Component({
  selector: 'app-gene-allele-list',
  templateUrl: './gene-allele-list.component.html',
  styleUrls: ['./gene-allele-list.component.css']
})
export class GeneAlleleListComponent implements OnChanges {
  @Input() alleles: Array<AlleleShort>;

  sortByColumnName: string = 'type';

  constructor() { }

  sortBy(columnName: 'name'|'description'|'type'): void {
    this.sortByColumnName = columnName;

    this.sortTable();
  }

  sortTable(): void {
    const nameDesc = (a: AlleleShort) => (a.name || 'unknown') + '(' + (a.name || 'unknown') + ')';
    if (this.sortByColumnName == 'type') {
      this.alleles.sort((a, b) => {
        if (a.allele_type === b.allele_type) {
          return nameDesc(a).localeCompare(nameDesc(b));
        } else {
          return a.allele_type.localeCompare(b.allele_type);
        }
      });
    } else {
      this.alleles.sort((a, b) => {
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
          result = a.allele_type.localeCompare(b.allele_type);
        }

        return result;
      })

    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.sortTable();
  }
}
