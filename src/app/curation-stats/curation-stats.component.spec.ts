import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurationStatsComponent } from './curation-stats.component';

describe('CurationStatsComponent', () => {
  let component: CurationStatsComponent;
  let fixture: ComponentFixture<CurationStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurationStatsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurationStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
