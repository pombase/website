/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { GeneNeighbourhoodComponent } from './gene-neighbourhood.component';

describe('GeneNeighbourhoodComponent', () => {
  let component: GeneNeighbourhoodComponent;
  let fixture: ComponentFixture<GeneNeighbourhoodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneNeighbourhoodComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneNeighbourhoodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
