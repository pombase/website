import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { OrthologAnnotation, GeneShort, ReferenceShort, GeneDetails } from '../pombase-api.service';
import { getAnnotationTableConfig, AnnotationTableConfig,
         getOrganismExternalLink, ConfigOrganism, getAppConfig, ExternalGeneReference, AppConfig} from '../config';
import { MessageDialogComponent } from '../message-dialog/message-dialog.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-ortholog-annotation-table',
  templateUrl: './ortholog-annotation-table.component.html',
  styleUrls: ['./ortholog-annotation-table.component.css']
})
export class OrthologAnnotationTableComponent implements OnInit, OnChanges {
  @Input() currentGene: GeneDetails;
  @Input() hideColumns: Array<string> = [];
  @Input() annotationTable: Array<OrthologAnnotation>;

  config: AnnotationTableConfig = getAnnotationTableConfig();
  appConfig: AppConfig = getAppConfig();
  annotationTypeDisplayName: string;
  hideColumn: { [key: string]: boolean } = {};

  extRefConfs: Array<ExternalGeneReference> = [];

  fullProductRef: BsModalRef;

  displayTable: Array<{
    gene: GeneShort;
    ortholog: GeneShort;
    orthologOrganism: ConfigOrganism;
    orthologShortProduct?: string;
    orthologFullProduct?: string;
    reference: ReferenceShort;
  }> = [];

  getLink(organism: ConfigOrganism, uniquename: string, name?: string): string {
    return getOrganismExternalLink(organism.genus, organism.species, uniquename, name) || '';
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

  displayOrthologPredictionResources(): boolean {
    return this.currentGene && this.appConfig.isConfigOrganism(this.currentGene.taxonid) &&
      (this.currentGene.feature_type === 'mRNA gene' ||
       this.currentGene.feature_type === 'pseudogene');
  }

  ngOnInit() {
    let typeConfig = this.config.annotationTypes['orthologs'];
    this.annotationTypeDisplayName = typeConfig.display_name;

    this.hideColumns.map(col => {
      this.hideColumn[col] = true;
    });
  }

  ngOnChanges() {
    this.displayTable =
      this.annotationTable
        .filter(row => !!row.ortholog_organism)
        .map(row => {
        let shortProduct;

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
          reference: row.reference,
        };
      });
  }
}
