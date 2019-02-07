import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnotationTableFiltersComponent } from './annotation-table-filters.component';

describe('AnnotationTableFiltersComponent', () => {
  let component: AnnotationTableFiltersComponent;
  let fixture: ComponentFixture<AnnotationTableFiltersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnnotationTableFiltersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnotationTableFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
