import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnotationTableTermFilterComponent } from './annotation-table-term-filter.component';

describe('AnnotationTableTermFilterComponent', () => {
  let component: AnnotationTableTermFilterComponent;
  let fixture: ComponentFixture<AnnotationTableTermFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnnotationTableTermFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnotationTableTermFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
