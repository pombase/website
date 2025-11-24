import { Component } from '@angular/core';

import { PombaseAPIService, TestimonialConfig } from '../../pombase-api.service';

@Component({
  selector: 'app-testimonial-list',
  templateUrl: './testimonial-list.component.html',
  styleUrl: './testimonial-list.component.css',
  standalone: false
})
export class TestimonialListComponent {
  testimonials: Array<TestimonialConfig> = [];

  constructor(private pombaseApiService: PombaseAPIService) {
    const testimonialsPromise = this.pombaseApiService.getTestimonialConfig('all', 'full');
    testimonialsPromise.then(res => {
      this.testimonials = res.map(t => {
        return {
          quote: '<p>' + t.quote,
          author: t.author,
          location: t.location,
        }
      });
    });
  }
}
