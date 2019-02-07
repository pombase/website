import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletionViabilitySummaryComponent } from './deletion-viability-summary.component';

describe('DeletionViabilitySummaryComponent', () => {
  let component: DeletionViabilitySummaryComponent;
  let fixture: ComponentFixture<DeletionViabilitySummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeletionViabilitySummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeletionViabilitySummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
