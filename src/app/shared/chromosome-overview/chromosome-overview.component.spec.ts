import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChromosomeOverviewComponent } from './chromosome-overview.component';

describe('ChromosomeOverviewComponent', () => {
  let component: ChromosomeOverviewComponent;
  let fixture: ComponentFixture<ChromosomeOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChromosomeOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChromosomeOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
