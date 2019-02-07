import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneExternalReferencesComponent } from './gene-external-references.component';

describe('GeneExternalReferencesComponent', () => {
  let component: GeneExternalReferencesComponent;
  let fixture: ComponentFixture<GeneExternalReferencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneExternalReferencesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneExternalReferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
