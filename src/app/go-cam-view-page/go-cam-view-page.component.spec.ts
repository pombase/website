import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoCamViewPageComponent } from './go-cam-view-page.component';

describe('GoCamViewPageComponent', () => {
  let component: GoCamViewPageComponent;
  let fixture: ComponentFixture<GoCamViewPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoCamViewPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoCamViewPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
