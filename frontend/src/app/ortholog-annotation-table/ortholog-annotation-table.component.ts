import { Component, Input, OnInit } from '@angular/core';
import { OrthologAnnotation, GeneShort } from '../pombase-api.service';
import { getAnnotationTableConfig, AnnotationTableConfig,
         getOrganismExternalLink } from '../config';

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

  getLink(organism: any, uniquename: string): string {
    return getOrganismExternalLink(organism.genus, organism.species, uniquename);
  }

  constructor() { }

  ngOnInit() {
    let typeConfig = this.config.annotationTypes['orthologs'];
    this.annotationTypeDisplayName = typeConfig.display_name;

    this.hideColumns.map(col => {
      this.hideColumn[col] = true;
    });
  }
}
