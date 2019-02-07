import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenotypeAlleleSummaryComponent } from './genotype-allele-summary.component';

describe('GenotypeAlleleSummaryComponent', () => {
  let component: GenotypeAlleleSummaryComponent;
  let fixture: ComponentFixture<GenotypeAlleleSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenotypeAlleleSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenotypeAlleleSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
