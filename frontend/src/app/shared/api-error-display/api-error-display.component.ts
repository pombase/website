import { Component, OnInit, Input } from '@angular/core';
import { APIError } from '../../pombase-api.service';

@Component({
  selector: 'app-api-error-display',
  templateUrl: './api-error-display.component.html',
  styleUrls: ['./api-error-display.component.css']
})
export class ApiErrorDisplayComponent implements OnInit {
  @Input() error: APIError = null;

  constructor() { }

  ngOnInit() {
  }

}
