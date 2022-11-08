import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneticInteractionTableFiltersComponent } from './genetic-interaction-table-filters.component';

describe('GeneticInteractionTableFiltersComponent', () => {
  let component: GeneticInteractionTableFiltersComponent;
  let fixture: ComponentFixture<GeneticInteractionTableFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneticInteractionTableFiltersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneticInteractionTableFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
