import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MotifSearchHelpComponent } from './motif-search-help.component';

describe('MotifSearchHelpComponent', () => {
  let component: MotifSearchHelpComponent;
  let fixture: ComponentFixture<MotifSearchHelpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MotifSearchHelpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MotifSearchHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
