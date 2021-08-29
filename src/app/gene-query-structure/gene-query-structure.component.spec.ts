import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneQueryStructureComponent } from './gene-query-structure.component';

describe('GeneQueryStructureComponent', () => {
  let component: GeneQueryStructureComponent;
  let fixture: ComponentFixture<GeneQueryStructureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneQueryStructureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneQueryStructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
