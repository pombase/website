import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InteractionTableThroughputFilterComponent } from './interaction-table-throughput-filter.component';

describe('InteractionTableThroughputFilterComponent', () => {
  let component: InteractionTableThroughputFilterComponent;
  let fixture: ComponentFixture<InteractionTableThroughputFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InteractionTableThroughputFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InteractionTableThroughputFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
