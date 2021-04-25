import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnotationTablePloidinessFilterComponent } from './annotation-table-ploidiness-filter.component';

describe('AnnotationTablePloidinessFilterComponent', () => {
  let component: AnnotationTablePloidinessFilterComponent;
  let fixture: ComponentFixture<AnnotationTablePloidinessFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnnotationTablePloidinessFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnotationTablePloidinessFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
