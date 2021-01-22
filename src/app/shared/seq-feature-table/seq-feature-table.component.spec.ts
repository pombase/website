import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeqFeatureTableComponent } from './seq-feature-table.component';

describe('SeqFeatureTableComponent', () => {
  let component: SeqFeatureTableComponent;
  let fixture: ComponentFixture<SeqFeatureTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeqFeatureTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeqFeatureTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
