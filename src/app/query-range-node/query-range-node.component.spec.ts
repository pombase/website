import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryRangeNodeComponent } from './query-range-node.component';

describe('QueryRangeNodeComponent', () => {
  let component: QueryRangeNodeComponent;
  let fixture: ComponentFixture<QueryRangeNodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QueryRangeNodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryRangeNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
