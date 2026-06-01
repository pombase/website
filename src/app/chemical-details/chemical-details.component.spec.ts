import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChemicalDetailsComponent } from './chemical-details.component';

describe('ChemicalDetailsComponent', () => {
  let component: ChemicalDetailsComponent;
  let fixture: ComponentFixture<ChemicalDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChemicalDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChemicalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
