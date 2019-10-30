import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneResultsPageComponent } from './gene-results-page.component';

describe('GeneResultsPageComponent', () => {
  let component: GeneResultsPageComponent;
  let fixture: ComponentFixture<GeneResultsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneResultsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneResultsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
