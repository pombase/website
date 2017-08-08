import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PredefinedQueryResultsComponent } from './predefined-query-results.component';

describe('PredefinedQueryResultsComponent', () => {
  let component: PredefinedQueryResultsComponent;
  let fixture: ComponentFixture<PredefinedQueryResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PredefinedQueryResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PredefinedQueryResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
