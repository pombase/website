import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnotationTableThroughputFilterComponent } from './annotation-table-throughput-filter.component';

describe('AnnotationTableThroughputFilterComponent', () => {
  let component: AnnotationTableThroughputFilterComponent;
  let fixture: ComponentFixture<AnnotationTableThroughputFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnnotationTableThroughputFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnotationTableThroughputFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
