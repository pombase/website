import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProteinFeatureTableComponent } from './protein-feature-table.component';

describe('ProteinFeatureTableComponent', () => {
  let component: ProteinFeatureTableComponent;
  let fixture: ComponentFixture<ProteinFeatureTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProteinFeatureTableComponent]
    });
    fixture = TestBed.createComponent(ProteinFeatureTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
