import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryGenomeRangeNodeComponent } from './query-genome-range-node.component';

describe('QueryGenomeRangeNodeComponent', () => {
  let component: QueryGenomeRangeNodeComponent;
  let fixture: ComponentFixture<QueryGenomeRangeNodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QueryGenomeRangeNodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryGenomeRangeNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
