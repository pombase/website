import { Component, OnInit, OnChanges, Input,
         ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { GeneDetails, ProteinComplexDetails } from '../pombase-api.service';
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

  constructor(private changeDetectorRef: ChangeDetectorRef,
              private sanitizer: DomSanitizer) { }

  complexPortalUrl(complexId: string): string {
    const xrfDetails = getXrfWithPrefix('ComplexPortal', complexId)!;
    return xrfDetails.url;
  }

  getIFrameURL(complexId: string): SafeResourceUrl {
    const rawUrl = '/complex_viewer/' + complexId;
    return this.sanitizer.bypassSecurityTrustResourceUrl(rawUrl);
  }

  complexChanged() {
    this.changeDetectorRef.detectChanges();
  }

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.geneDetails) {
      this.complexes = this.geneDetails.complexes;
      this.currentComplex = this.complexes[0];
    } else {
      this.complexes = [];
      this.currentComplex = undefined;
    }
  }
}
