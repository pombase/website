/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TermAnnotationTableComponent } from './term-annotation-table.component';

describe('TermAnnotationTableComponent', () => {
  let component: TermAnnotationTableComponent;
  let fixture: ComponentFixture<TermAnnotationTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TermAnnotationTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TermAnnotationTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
