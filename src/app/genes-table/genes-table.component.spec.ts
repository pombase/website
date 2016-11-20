/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { GenesTableComponent } from './genes-table.component';

describe('GenesTableComponent', () => {
  let component: GenesTableComponent;
  let fixture: ComponentFixture<GenesTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenesTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
