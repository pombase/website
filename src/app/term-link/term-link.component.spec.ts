import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermLinkComponent } from './term-link.component';

describe('TermLinkComponent', () => {
  let component: TermLinkComponent;
  let fixture: ComponentFixture<TermLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TermLinkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TermLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
