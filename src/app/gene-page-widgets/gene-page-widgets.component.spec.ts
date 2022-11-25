import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenePageWidgetsComponent } from './gene-page-widgets.component';

describe('GenePageWidgetsComponent', () => {
  let component: GenePageWidgetsComponent;
  let fixture: ComponentFixture<GenePageWidgetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenePageWidgetsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenePageWidgetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
