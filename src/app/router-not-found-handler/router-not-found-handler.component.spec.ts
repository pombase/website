import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterNotFoundHandlerComponent } from './router-not-found-handler.component';

describe('RouterNotFoundHandlerComponent', () => {
  let component: RouterNotFoundHandlerComponent;
  let fixture: ComponentFixture<RouterNotFoundHandlerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RouterNotFoundHandlerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RouterNotFoundHandlerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
