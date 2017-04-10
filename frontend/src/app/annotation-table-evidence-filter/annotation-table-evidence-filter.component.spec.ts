import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnotationTableEvidenceFilterComponent } from './annotation-table-evidence-filter.component';

describe('AnnotationTableEvidenceFilterComponent', () => {
  let component: AnnotationTableEvidenceFilterComponent;
  let fixture: ComponentFixture<AnnotationTableEvidenceFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnnotationTableEvidenceFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnotationTableEvidenceFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
