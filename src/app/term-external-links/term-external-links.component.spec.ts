import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TermExternalLinksComponent } from './term-external-links.component';

describe('TermExternalLinksComponent', () => {
  let component: TermExternalLinksComponent;
  let fixture: ComponentFixture<TermExternalLinksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TermExternalLinksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TermExternalLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
