import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MotifSearchComponent } from './motif-search.component';

describe('MotifSearchComponent', () => {
  let component: MotifSearchComponent;
  let fixture: ComponentFixture<MotifSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MotifSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MotifSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
