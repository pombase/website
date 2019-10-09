import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JbrowseTrackPickerComponent } from './jbrowse-track-picker.component';

describe('JbrowseTrackPickerComponent', () => {
  let component: JbrowseTrackPickerComponent;
  let fixture: ComponentFixture<JbrowseTrackPickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JbrowseTrackPickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JbrowseTrackPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
