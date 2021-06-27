import { Component, OnInit, OnChanges, Input } from '@angular/core';

import { TermDetails, TermAndRelation, PombaseAPIService,
         TermSubsets, ReferenceShort} from '../pombase-api.service';
import { getAnnotationTableConfig, AnnotationTableConfig,
         getAppConfig, AnnotationType, getXrf } from '../config';
import { Router } from '@angular/router';

interface XrefDetails {
  identifier: string;
  refShort?: ReferenceShort;
  url?: string;
}

@Component({
  selector: 'app-term-page-summary',
  templateUrl: './term-page-summary.component.html',
  styleUrls: ['./term-page-summary.component.css']
})
export class TermPageSummaryComponent implements OnInit, OnChanges {
  @Input() termDetails: TermDetails;

  filteredAncestors: Array<TermAndRelation> = [];
  subsets: TermSubsets = {};
  typeConfig: AnnotationType;
  slimConfig = getAppConfig().slims;
  slimConfigNames = Object.keys(this.slimConfig);
  config: AnnotationTableConfig = getAnnotationTableConfig();
  defXrefs: Array<XrefDetails> = [];

  displayTermId = '';
  nameAndIdPrefix = 'Ontology term';

  constructor(private router: Router,
              private pombaseApiService: PombaseAPIService) { }

  isInSubset(subsetName: string): boolean {
    if (!this.subsets[subsetName]) {
      return false;
    }
    for (let termid of Object.keys(this.subsets[subsetName].elements)) {
      if (termid === this.termDetails.termid) {
        return true;
      }
    }

    return false;
  }

  goToFullSlim(slimName: string) {
    this.router.navigate([this.slimConfig[slimName].full_slim_path]);
  }

  filterAncestors(): void {
    let termPageConfig = getAppConfig().termPageConfig;

    this.filteredAncestors =
      this.termDetails.direct_ancestors.filter(termAndRel => {
        return termPageConfig.ancestorRelNames.indexOf(termAndRel.relation_name) !== -1;
      });
  }

  ngOnInit() {
    this.pombaseApiService.getTermSubsets()
      .then((termSubsets) => this.subsets = termSubsets);
  }

  ngOnChanges() {
    this.filterAncestors();
    this.typeConfig =
      getAnnotationTableConfig().getAnnotationType(this.termDetails.cv_name);
    if (this.typeConfig.hide_term_id_prefix) {
      this.displayTermId = this.termDetails.termid.replace(/^.*?:/, '');
    } else {
      this.displayTermId = this.termDetails.termid;
    }
    if (this.typeConfig.is_a_fake_ontology) {
      this.nameAndIdPrefix = this.typeConfig.display_name;
    } else {
      this.nameAndIdPrefix = 'Ontology term';
    }
    this.defXrefs = [];
    if (this.termDetails.definition_xrefs) {
      this.termDetails.definition_xrefs
        .filter(xref => {
          return xref.startsWith('PMID:') || xref.startsWith('ISBN:') ||
            xref.startsWith('DOI:');
        })
        .map((xref: string) => {
          const refShort = this.termDetails.references_by_uniquename[xref];
          if (refShort) {
            this.defXrefs.push({
              identifier: xref,
              refShort: refShort,
              url: undefined,
            } as XrefDetails);
          } else {
            const xrefConf = getXrf(xref);
            let url: string|undefined = undefined;
            if (xrefConf) {
              url = xrefConf.url;
            }
            this.defXrefs.push({
              identifier: xref,
              refShort: undefined,
              url,
            } as XrefDetails);
          }
        })
    }
  }
}

