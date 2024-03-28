import { Component, Input } from '@angular/core';
import { Annotation } from '../pombase-api.service';

@Component({
  selector: 'app-allele-promoter-list',
  templateUrl: './allele-promoter-list.component.html',
  styleUrls: ['./allele-promoter-list.component.css']
})
export class AllelePromoterListComponent {
  @Input() annotation: Annotation;

}
