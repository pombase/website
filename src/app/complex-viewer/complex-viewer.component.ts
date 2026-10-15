import { Component, OnInit, OnChanges, Input,
         ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PombaseAPIService, GeneSummaryMap, GeneSummary,
         GeneDetails, ProteinComplexDetails } from '../pombase-api.service';
import { getXrfWithPrefix } from '../config';

@Component({
  selector: 'app-complex-viewer',
  templateUrl: './complex-viewer.component.html',
  styleUrl: './complex-viewer.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class ComplexViewerComponent implements OnInit, OnChanges {
  @Input() geneDetails: GeneDetails;

  complexes: Array<ProteinComplexDetails> = [];
  currentComplexUniquename?: string = undefined;
  currentComplex?: ProteinComplexDetails = undefined;
  currentGenes: Array<GeneSummary> = [];

  private geneSummaryMapPromise: Promise<GeneSummaryMap>;

  constructor(private changeDetectorRef: ChangeDetectorRef,
              private sanitizer: DomSanitizer,
              private pombaseApiService: PombaseAPIService) {
    this.geneSummaryMapPromise = this.pombaseApiService.getGeneSummaryMapPromise();
  }

  complexPortalUrl(complexId: string): string {
    const xrfDetails = getXrfWithPrefix('ComplexPortal', complexId)!;
    return xrfDetails.url;
  }

  getIFrameURL(complexId: string): SafeResourceUrl {
    const rawUrl = '/complex_viewer/' + complexId;
    return this.sanitizer.bypassSecurityTrustResourceUrl(rawUrl);
  }

  complexChanged() {
    this.setGenes();
    this.changeDetectorRef.detectChanges(); 
  }

  setGenes() {
    this.currentGenes = [];
    this.geneSummaryMapPromise.then(summaryMap => {
      if (this.currentComplex) {
        this.currentGenes = this.currentComplex.genes
          .map(geneUniquename => summaryMap[geneUniquename])
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  ngOnInit() {
    console.log("ngOnInit()")
  }

  ngOnChanges() {
    console.log("ngOnChanges()")
    if (this.geneDetails) {
      this.complexes = this.geneDetails.complexes;
      this.currentComplex = this.complexes[0];
      this.setGenes();
    } else {
      this.complexes = [];
      this.currentComplex = undefined;
      this.currentGenes = [];
    }
  }
}
