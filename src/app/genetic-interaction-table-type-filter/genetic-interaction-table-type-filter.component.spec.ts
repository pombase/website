import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneticInteractionTableTypeFilterComponent } from './genetic-interaction-table-type-filter.component';

describe('GeneticInteractionTableTypeFilterComponent', () => {
  let component: GeneticInteractionTableTypeFilterComponent;
  let fixture: ComponentFixture<GeneticInteractionTableTypeFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneticInteractionTableTypeFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneticInteractionTableTypeFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
