import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuerySubNodesComponent } from './query-sub-nodes.component';

describe('QuerySubNodesComponent', () => {
  let component: QuerySubNodesComponent;
  let fixture: ComponentFixture<QuerySubNodesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuerySubNodesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuerySubNodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
