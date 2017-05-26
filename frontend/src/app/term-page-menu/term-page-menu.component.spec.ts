import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TermPageMenuComponent } from './term-page-menu.component';

describe('TermPageMenuComponent', () => {
  let component: TermPageMenuComponent;
  let fixture: ComponentFixture<TermPageMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TermPageMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TermPageMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
