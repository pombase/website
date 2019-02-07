import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TranscriptViewComponent } from './transcript-view.component';

describe('TranscriptViewComponent', () => {
  let component: TranscriptViewComponent;
  let fixture: ComponentFixture<TranscriptViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TranscriptViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TranscriptViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
