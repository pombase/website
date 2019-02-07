import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferenceShortListComponent } from './reference-short-list.component';

describe('ReferenceShortListComponent', () => {
  let component: ReferenceShortListComponent;
  let fixture: ComponentFixture<ReferenceShortListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferenceShortListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferenceShortListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
