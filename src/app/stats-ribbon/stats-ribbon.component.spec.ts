import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsRibbonComponent } from './stats-ribbon.component';

describe('StatsRibbonComponent', () => {
  let component: StatsRibbonComponent;
  let fixture: ComponentFixture<StatsRibbonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatsRibbonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatsRibbonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
