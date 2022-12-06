import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenotypeReferencesTableComponent } from './genotype-references-table.component';

describe('GenotypeReferencesTableComponent', () => {
  let component: GenotypeReferencesTableComponent;
  let fixture: ComponentFixture<GenotypeReferencesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenotypeReferencesTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenotypeReferencesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
