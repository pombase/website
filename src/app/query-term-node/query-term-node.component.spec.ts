import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryTermNodeComponent } from './query-term-node.component';

describe('QueryTermNodeComponent', () => {
  let component: QueryTermNodeComponent;
  let fixture: ComponentFixture<QueryTermNodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueryTermNodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryTermNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
