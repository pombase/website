import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProteinFeatureViewerComponent } from './protein-feature-viewer.component';

describe('ProteinFeatureViewerComponent', () => {
  let component: ProteinFeatureViewerComponent;
  let fixture: ComponentFixture<ProteinFeatureViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProteinFeatureViewerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProteinFeatureViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
