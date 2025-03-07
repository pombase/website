import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneResultsSubsetCountComponent } from './gene-results-subset-count.component';

describe('GeneResultsSubsetCountComponent', () => {
  let component: GeneResultsSubsetCountComponent;
  let fixture: ComponentFixture<GeneResultsSubsetCountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneResultsSubsetCountComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneResultsSubsetCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
