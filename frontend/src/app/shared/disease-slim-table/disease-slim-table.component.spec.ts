import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiseaseSlimTableComponent } from './disease-slim-table.component';

describe('DiseaseSlimTableComponent', () => {
  let component: DiseaseSlimTableComponent;
  let fixture: ComponentFixture<DiseaseSlimTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiseaseSlimTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiseaseSlimTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
