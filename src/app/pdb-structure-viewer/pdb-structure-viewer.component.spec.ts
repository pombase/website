import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdbStructureViewerComponent } from './pdb-structure-viewer.component';

describe('PdbStructureViewerComponent', () => {
  let component: PdbStructureViewerComponent;
  let fixture: ComponentFixture<PdbStructureViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PdbStructureViewerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PdbStructureViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
