import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalRefsTableComponent } from './external-refs-table.component';

describe('ExternalRefsTableComponent', () => {
  let component: ExternalRefsTableComponent;
  let fixture: ComponentFixture<ExternalRefsTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExternalRefsTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalRefsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
