import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoSlimTableComponent } from './go-slim-table.component';

describe('GoSlimTableComponent', () => {
  let component: GoSlimTableComponent;
  let fixture: ComponentFixture<GoSlimTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoSlimTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoSlimTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
