import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TranscriptSequenceSelectComponent } from './transcript-sequence-select.component';

describe('TranscriptSequenceSelectComponent', () => {
  let component: TranscriptSequenceSelectComponent;
  let fixture: ComponentFixture<TranscriptSequenceSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TranscriptSequenceSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TranscriptSequenceSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
