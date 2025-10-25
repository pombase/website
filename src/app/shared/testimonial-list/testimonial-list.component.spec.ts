import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestimonialListComponent } from './testimonial-list.component';

describe('TestimonialListComponent', () => {
  let component: TestimonialListComponent;
  let fixture: ComponentFixture<TestimonialListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestimonialListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestimonialListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
