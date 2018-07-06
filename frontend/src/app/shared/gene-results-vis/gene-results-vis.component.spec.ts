import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneResultsVisComponent } from './gene-results-vis.component';

describe('GeneResultsVisComponent', () => {
  let component: GeneResultsVisComponent;
  let fixture: ComponentFixture<GeneResultsVisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneResultsVisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneResultsVisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
