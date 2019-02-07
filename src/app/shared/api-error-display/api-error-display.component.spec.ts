import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiErrorDisplayComponent } from './api-error-display.component';

describe('ApiErrorDisplayComponent', () => {
  let component: ApiErrorDisplayComponent;
  let fixture: ComponentFixture<ApiErrorDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApiErrorDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiErrorDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
