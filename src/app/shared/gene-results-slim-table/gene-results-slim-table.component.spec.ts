import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneResultsSlimTableComponent } from './gene-results-slim-table.component';

describe('GeneResultsSlimTableComponent', () => {
  let component: GeneResultsSlimTableComponent;
  let fixture: ComponentFixture<GeneResultsSlimTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneResultsSlimTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneResultsSlimTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
