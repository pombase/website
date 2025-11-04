import { Component } from '@angular/core';

import { getAppConfig } from '../../config';

@Component({
  selector: 'app-testimonial-list',
  templateUrl: './testimonial-list.component.html',
  styleUrl: './testimonial-list.component.css',
  standalone: false
})
export class TestimonialListComponent {

  testimonials: Array<{ quote: string, author: string }> = [];

  constructor() {
    if (getAppConfig().testimonials) {
      this.testimonials = getAppConfig().testimonials
        .filter(t => t.location === 'FULL' || t.location == 'BOTH')
        .map(t => {
          return {
            quote: '<p>' + t.quote,
            author: t.author,
          }
        });
    }
  }
}
