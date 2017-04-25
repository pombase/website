import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoSlimSummaryComponent } from './go-slim-summary.component';

describe('GoSlimSummaryComponent', () => {
  let component: GoSlimSummaryComponent;
  let fixture: ComponentFixture<GoSlimSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoSlimSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoSlimSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
