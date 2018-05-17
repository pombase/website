import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnotationTableExtLinksComponent } from './annotation-table-ext-links.component';

describe('AnnotationTableExtLinksComponent', () => {
  let component: AnnotationTableExtLinksComponent;
  let fixture: ComponentFixture<AnnotationTableExtLinksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnnotationTableExtLinksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnotationTableExtLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
