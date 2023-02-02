import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneHistoryTableComponent } from './gene-history-table.component';

describe('GeneHistoryTableComponent', () => {
  let component: GeneHistoryTableComponent;
  let fixture: ComponentFixture<GeneHistoryTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneHistoryTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneHistoryTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
