import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GocamTotalStatsComponent } from './gocam-total-stats.component';

describe('GocamTotalStatsComponent', () => {
  let component: GocamTotalStatsComponent;
  let fixture: ComponentFixture<GocamTotalStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GocamTotalStatsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GocamTotalStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
