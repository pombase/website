import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalDetailsComponent } from './internal-details.component';

describe('InternalDetailsComponent', () => {
  let component: InternalDetailsComponent;
  let fixture: ComponentFixture<InternalDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InternalDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
