import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelArchiveComponent } from './panel-archive.component';

describe('PanelArchiveComponent', () => {
  let component: PanelArchiveComponent;
  let fixture: ComponentFixture<PanelArchiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelArchiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelArchiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
