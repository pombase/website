import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferenceDetailListComponent } from './reference-detail-list.component';

describe('ReferenceDetailListComponent', () => {
  let component: ReferenceDetailListComponent;
  let fixture: ComponentFixture<ReferenceDetailListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferenceDetailListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferenceDetailListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
