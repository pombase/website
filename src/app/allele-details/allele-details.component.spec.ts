import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlleleDetailsComponent } from './allele-details.component';

describe('AlleleDetailsComponent', () => {
  let component: AlleleDetailsComponent;
  let fixture: ComponentFixture<AlleleDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlleleDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlleleDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
