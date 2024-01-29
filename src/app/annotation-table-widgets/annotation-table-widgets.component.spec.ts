import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnotationTableWidgetsComponent } from './annotation-table-widgets.component';

describe('AnnotationTableWidgetsComponent', () => {
  let component: AnnotationTableWidgetsComponent;
  let fixture: ComponentFixture<AnnotationTableWidgetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnnotationTableWidgetsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnnotationTableWidgetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
