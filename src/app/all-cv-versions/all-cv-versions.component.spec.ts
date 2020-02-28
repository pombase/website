import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllCvVersionsComponent } from './all-cv-versions.component';

describe('AllCvVersionsComponent', () => {
  let component: AllCvVersionsComponent;
  let fixture: ComponentFixture<AllCvVersionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllCvVersionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllCvVersionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
