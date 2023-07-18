import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneProteinFeaturesComponent } from './gene-protein-features.component';

describe('GeneProteinFeaturesComponent', () => {
  let component: GeneProteinFeaturesComponent;
  let fixture: ComponentFixture<GeneProteinFeaturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneProteinFeaturesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneProteinFeaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
