import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterproMatchesComponent } from './interpro-matches.component';

describe('InterproMatchesComponent', () => {
  let component: InterproMatchesComponent;
  let fixture: ComponentFixture<InterproMatchesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterproMatchesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterproMatchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
