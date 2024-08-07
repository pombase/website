import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicationBadgeComponent } from './publication-badge.component';

describe('PublicationBadgeComponent', () => {
  let component: PublicationBadgeComponent;
  let fixture: ComponentFixture<PublicationBadgeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PublicationBadgeComponent]
    });
    fixture = TestBed.createComponent(PublicationBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
