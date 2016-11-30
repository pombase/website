/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { QueryNodeComponent } from './query-node.component';

describe('QueryNodeComponent', () => {
  let component: QueryNodeComponent;
  let fixture: ComponentFixture<QueryNodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueryNodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
