import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MiscAnnotationTableComponent } from './misc-annotation-table.component';

describe('MiscAnnotationTableComponent', () => {
  let component: MiscAnnotationTableComponent;
  let fixture: ComponentFixture<MiscAnnotationTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MiscAnnotationTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MiscAnnotationTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
