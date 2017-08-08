import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryLinkComponent } from './query-link.component';

describe('QueryLinkComponent', () => {
  let component: QueryLinkComponent;
  let fixture: ComponentFixture<QueryLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueryLinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
