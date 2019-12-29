import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { GeneSummary } from '../../pombase-api.service';
import { GenesDownloadDialogComponent } from '../../genes-download-dialog/genes-download-dialog.component';
import { QueryService, HistoryEntry } from '../../query.service';
import { GeneQuery, GeneListNode, TermShort } from '../../pombase-query';
import { getAppConfig } from '../../config';
import { DeployConfigService } from '../../deploy-config.service';
import { GenesTableConfigComponent } from '../../genes-table-config/genes-table-config.component';
import { SettingsService } from '../../settings.service';
import { Subscription } from 'rxjs';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { QueryRouterService } from '../../query-router.service';

@Component({
  selector: 'app-genes-table',
  templateUrl: './genes-table.component.html',
  styleUrls: ['./genes-table.component.css']
})
export class GenesTableComponent implements OnInit {
  @Input() mode = 'results';
  @Input() description: string;

  // a decomposed version of the description as an Array of Objects
  // like: [{text: "abnormal cell ... ("}, {term: <a TermShort>}, {text: ")"}, ...]
  // which allows the the termids in a description to be linked to the term pages
  @Input() descriptionParts: Array<({ text?: string; term?: TermShort; })> = [];
  @Input() genes: Array<GeneSummary> = [];

  legend = 'Results';

  faCog = faCog;

  orderByField = 'gene';
  orderByFieldDisplayName = 'Gene name';
  downloadModalRef: BsModalRef = null;
  selectedCountCache = -1;

  slimName: string = null;

  fieldDisplayNames = GeneSummary.getDisplayFieldNames();
  fieldDisplayValueGenerators = GeneSummary;

  sortableColumns = getAppConfig().getGeneResultsConfig().sortable_columns;
  visibleFieldNames: Array<string> = [];

  visDescription: string = null;

  tooManyGenesTitle = 'Too many genes for select mode, try the "Gene list" option from the Search menu';
  selectGenesTitle = 'Start gene selection and filtering mode';

  selectedGenes: { [key: string]: boolean } = null;

  geneResultConfig = getAppConfig().getGeneResultsConfig();
  slimDescription: string;

  slimNames: Array<string> = [];
  columnsSubscription: Subscription;

  constructor(private modalService: BsModalService,
              private sanitizer: DomSanitizer,
              private queryService: QueryService,
              private queryRouterSerive: QueryRouterService,
              private settingsService: SettingsService,
              private deployConfigService: DeployConfigService,
              private router: Router) {
    this.slimNames = this.geneResultConfig.slim_table_slim_names;

    this.visibleFieldNames = settingsService.visibleGenesTableColumns;

    this.columnsSubscription =
      settingsService.visibleGenesTableColumns$.subscribe(visbleColumns => this.visibleFieldNames = visbleColumns);
  }

  configureColumns(): void {
    const config = {
      animated: false,
      initialState: {
        visibleFieldNames: this.visibleFieldNames,
      },
    };
    this.downloadModalRef = this.modalService.show(GenesTableConfigComponent, config);
  }

  setOrderBy(fieldName: string) {
    this.orderByFieldDisplayName = fieldName;
    if (fieldName === 'Systematic ID') {
      this.orderByField = 'systematicId';
    } else {
      if (fieldName === 'Gene name') {
        this.orderByField = 'gene';
      } else {
        this.orderByField = 'product';
      }
    }
  }

  sortableField(fieldName: string): boolean {
    return this.sortableColumns.indexOf(fieldName) > -1;
  }

  download() {
    const config = {
      animated: false,
      initialState: {
        initialFields: this.visibleFieldNames,
        genes: this.genes,
      },
    };
    this.downloadModalRef = this.modalService.show(GenesDownloadDialogComponent, config);
  }

  selectionInProgress() {
    return this.selectedGenes != null;
  }

  startSelection() {
    this.selectedGenes = {};
    this.genes.map(gene => {
      this.selectedGenes[gene.uniquename] = false;
    });
    this.selectedCountCache = 0;
  }

  cancelSelection() {
    this.selectedGenes = null;
    this.selectedCountCache = -1;
  }

  selectAll() {
    Object.keys(this.selectedGenes).map(geneUniquename => {
      this.selectedGenes[geneUniquename] = true;
    });
    this.selectedCountCache = this.genes.length;
  }

  selectNone() {
    Object.keys(this.selectedGenes).map(geneUniquename => {
      this.selectedGenes[geneUniquename] = false;
    });
    this.selectedCountCache = 0;
  }

  selectionChanged() {
    this.selectedCountCache = -1;
  }

  selectedCount() {
    if (this.selectedCountCache === -1) {
      this.selectedCountCache = 0;
      Object.keys(this.selectedGenes).map(geneUniquename => {
        if (this.selectedGenes[geneUniquename]) {
          this.selectedCountCache++;
        }
      });

    }

    return this.selectedCountCache;
  }

  private makeGeneListQuery(genes: Array<GeneSummary>): GeneQuery {
    return new GeneQuery(this.description, new GeneListNode(genes));
  }

  filter() {
    const selectedGenes = this.genes.filter(gene => this.selectedGenes[gene.uniquename]);

    const geneQuery = this.makeGeneListQuery(selectedGenes);
    const callback = (historyEntry: HistoryEntry) => {
      this.router.navigate(['/results/from/id/', historyEntry.getEntryId()]);
    };
    this.queryService.runAndSaveToHistory(geneQuery, callback);

    this.selectedGenes = null;
    this.selectedCountCache = -1;
  }

  showVisualisation(): void {
    const query = this.makeGeneListQuery(this.genes);
    this.queryRouterSerive.gotoResults(query, 'vis');
  }

  showResults(): void {
    const query = this.makeGeneListQuery(this.genes);
    this.queryRouterSerive.gotoResults(query, 'results');
  }

  showSlim(subsetName: string): void {
    const query = this.makeGeneListQuery(this.genes);
    this.queryRouterSerive.gotoResults(query, 'slim:' + subsetName);
  }

  showingResults(): boolean {
    return this.mode === 'results';
  }

  showingVisualisation(): boolean {
    return this.mode === 'vis';
  }

  showingSlim(): boolean {
    return this.mode.startsWith('slim');
  }

  displayFieldValue (gene: GeneSummary, fieldName: string): string|SafeHtml {
    const rawValue = gene.getFieldDisplayValue(fieldName);
    if (fieldName.endsWith(' ortholog') && rawValue.indexOf(',') !== -1) {
      const htmlValue = rawValue.replace(/,/g , ',&#8203;');
      return this.sanitizer.bypassSecurityTrustHtml(htmlValue);
    } else {
      return rawValue;
    }
  }

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.mode.startsWith('slim:')) {
      this.slimName = this.mode.substr(5);
      this.slimDescription = getAppConfig().slims[this.slimName].slim_display_name;
    } else {
      this.slimName = null;
      this.slimDescription = null;
    }

    let geneBit = `${this.genes.length} gene`;
    if (this.genes.length != 1) {
      geneBit += 's';
    }

    if (this.showingVisualisation()) {
      this.legend = 'Visualising ' + geneBit;
    } else {
      if (this.showingSlim()) {
        this.legend = this.slimDescription + ' for ' + geneBit;
      } else {
        this.legend = 'Results - ' + geneBit;
      }
    }
  }

  ngOnDestroy(): void {
    this.columnsSubscription.unsubscribe();
  }
}
