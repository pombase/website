import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontPanelComponent } from './front-panel.component';

describe('FrontPanelComponent', () => {
  let component: FrontPanelComponent;
  let fixture: ComponentFixture<FrontPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrontPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrontPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
