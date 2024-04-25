import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoCamViewerComponent } from './go-cam-viewer.component';

describe('GoCamViewerComponent', () => {
  let component: GoCamViewerComponent;
  let fixture: ComponentFixture<GoCamViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoCamViewerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoCamViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
