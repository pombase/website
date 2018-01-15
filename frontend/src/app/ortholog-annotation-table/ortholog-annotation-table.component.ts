import { Component, Input, OnInit } from '@angular/core';
import { OrthologAnnotation, GeneShort } from '../pombase-api.service';
import { getAnnotationTableConfig, AnnotationTableConfig,
         getOrganismExternalLink } from '../config';
import { MessageDialogComponent } from '../message-dialog/message-dialog.component';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-ortholog-annotation-table',
  templateUrl: './ortholog-annotation-table.component.html',
  styleUrls: ['./ortholog-annotation-table.component.css']
})
export class OrthologAnnotationTableComponent implements OnInit {
  @Input() currentGene: GeneShort = null;
  @Input() hideColumns: Array<string> = [];
  @Input() annotationTable: Array<OrthologAnnotation>;

  config: AnnotationTableConfig = getAnnotationTableConfig();
  annotationTypeDisplayName = null;
  hideColumn = {};

  fullProductRef = null;

  displayTable = [];

  getLink(organism: any, uniquename: string, name: string): string {
    return getOrganismExternalLink(organism.genus, organism.species, uniquename, name);
  }

  constructor(private modalService: BsModalService) { }

  showFullProduct(geneUniquename: string, fullProduct: string) {
    const config = {
      animated: false,
    };
    this.fullProductRef = this.modalService.show(MessageDialogComponent, config);
    this.fullProductRef.content.title = 'Ortholog product for ' + geneUniquename;
    this.fullProductRef.content.message = fullProduct;
  }

  ngOnInit() {
    let typeConfig = this.config.annotationTypes['orthologs'];
    this.annotationTypeDisplayName = typeConfig.display_name;

    this.hideColumns.map(col => {
      this.hideColumn[col] = true;
    });

    this.displayTable =
      this.annotationTable.map(row => {
        let shortProduct = null;

        if (row.ortholog.product) {
          const m = row.ortholog.product.match(/([^;]+);/);

          if (m) {
            shortProduct = m[1];
          } else {
            shortProduct = row.ortholog.product;
          }
        }

        return {
          gene: row.gene,
          ortholog: row.ortholog,
          orthologOrganism: row.ortholog_organism,
          orthologShortProduct: shortProduct,
          orthologFullProduct: row.ortholog.product,
        };
      });
  }
}
