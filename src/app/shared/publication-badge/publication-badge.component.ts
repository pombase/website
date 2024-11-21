import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-publication-badge',
    templateUrl: './publication-badge.component.html',
    styleUrls: ['./publication-badge.component.css'],
    standalone: false
})
export class PublicationBadgeComponent {
  @Input() doi: string;
}
