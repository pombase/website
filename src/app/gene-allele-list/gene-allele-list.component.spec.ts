import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneAlleleListComponent } from './gene-allele-list.component';

describe('GeneAlleleListComponent', () => {
  let component: GeneAlleleListComponent;
  let fixture: ComponentFixture<GeneAlleleListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneAlleleListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneAlleleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
