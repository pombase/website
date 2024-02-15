import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsSummaryComponent } from './stats-summary.component';

describe('StatsSummaryComponent', () => {
  let component: StatsSummaryComponent;
  let fixture: ComponentFixture<StatsSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatsSummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatsSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
