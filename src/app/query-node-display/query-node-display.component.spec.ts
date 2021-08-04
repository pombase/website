import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryNodeDisplayComponent } from './query-node-display.component';

describe('QueryNodeDisplayComponent', () => {
  let component: QueryNodeDisplayComponent;
  let fixture: ComponentFixture<QueryNodeDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QueryNodeDisplayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryNodeDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
