import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllelePromoterListComponent } from './allele-promoter-list.component';

describe('AllelePromoterListComponent', () => {
  let component: AllelePromoterListComponent;
  let fixture: ComponentFixture<AllelePromoterListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllelePromoterListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllelePromoterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
