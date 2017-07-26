import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TermPageSummaryComponent } from './term-page-summary.component';

describe('TermPageSummaryComponent', () => {
  let component: TermPageSummaryComponent;
  let fixture: ComponentFixture<TermPageSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TermPageSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TermPageSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
