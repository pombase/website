import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneSubsetViewComponent } from './gene-subset-view.component';

describe('GeneSubsetViewComponent', () => {
  let component: GeneSubsetViewComponent;
  let fixture: ComponentFixture<GeneSubsetViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneSubsetViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneSubsetViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
