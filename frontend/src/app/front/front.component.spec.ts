/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FrontComponent } from './front.component';

describe('FrontComponent', () => {
  let component: FrontComponent;
  let fixture: ComponentFixture<FrontComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrontComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrontComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
