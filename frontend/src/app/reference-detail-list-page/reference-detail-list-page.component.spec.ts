import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferenceDetailListPageComponent } from './reference-detail-list-page.component';

describe('ReferenceDetailListPageComponent', () => {
  let component: ReferenceDetailListPageComponent;
  let fixture: ComponentFixture<ReferenceDetailListPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferenceDetailListPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferenceDetailListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
