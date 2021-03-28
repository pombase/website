import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackViewComponent } from './track-view.component';

describe('TrackViewComponent', () => {
  let component: TrackViewComponent;
  let fixture: ComponentFixture<TrackViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrackViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
