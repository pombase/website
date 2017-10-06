import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontPanelContentComponent } from './front-panel-content.component';

describe('FrontPanelContentComponent', () => {
  let component: FrontPanelContentComponent;
  let fixture: ComponentFixture<FrontPanelContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrontPanelContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrontPanelContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
