import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermPageWidgetsComponent } from './term-page-widgets.component';

describe('TermPageWidgetsComponent', () => {
  let component: TermPageWidgetsComponent;
  let fixture: ComponentFixture<TermPageWidgetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TermPageWidgetsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TermPageWidgetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
