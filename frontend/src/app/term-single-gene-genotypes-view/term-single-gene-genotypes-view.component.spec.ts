/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TermSingleGeneGenotypesViewComponent } from './term-single-gene-genotypes-view.component';

describe('TermSingleGeneGenotypesViewComponent', () => {
  let component: TermSingleGeneGenotypesViewComponent;
  let fixture: ComponentFixture<TermSingleGeneGenotypesViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TermSingleGeneGenotypesViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TermSingleGeneGenotypesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
