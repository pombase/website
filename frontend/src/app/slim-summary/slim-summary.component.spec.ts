import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlimSummaryComponent } from './slim-summary.component';

describe('SlimSummaryComponent', () => {
  let component: SlimSummaryComponent;
  let fixture: ComponentFixture<SlimSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlimSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlimSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
