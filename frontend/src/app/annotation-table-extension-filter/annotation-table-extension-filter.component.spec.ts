import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnotationTableExtensionFilterComponent } from './annotation-table-extension-filter.component';

describe('AnnotationTableExtensionFilterComponent', () => {
  let component: AnnotationTableExtensionFilterComponent;
  let fixture: ComponentFixture<AnnotationTableExtensionFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnnotationTableExtensionFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnotationTableExtensionFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
