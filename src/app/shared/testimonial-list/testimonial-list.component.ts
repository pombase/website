import { Component } from '@angular/core';

import { getAppConfig } from '../../config';

@Component({
  selector: 'app-testimonial-list',
  imports: [],
  templateUrl: './testimonial-list.component.html',
  styleUrl: './testimonial-list.component.css',
  standalone: false
})
export class TestimonialListComponent {

  testimonials = getAppConfig().testimonials || [];
}
