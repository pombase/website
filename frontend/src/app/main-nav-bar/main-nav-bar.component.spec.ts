import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainNavBarComponent } from './main-nav-bar.component';

describe('MainNavBarComponent', () => {
  let component: MainNavBarComponent;
  let fixture: ComponentFixture<MainNavBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainNavBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainNavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
