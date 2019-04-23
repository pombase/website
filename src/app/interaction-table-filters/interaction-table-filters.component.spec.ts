import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InteractionTableFiltersComponent } from './interaction-table-filters.component';

describe('InteractionTableFiltersComponent', () => {
  let component: InteractionTableFiltersComponent;
  let fixture: ComponentFixture<InteractionTableFiltersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InteractionTableFiltersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InteractionTableFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
