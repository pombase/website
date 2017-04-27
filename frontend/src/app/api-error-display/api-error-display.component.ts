import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-api-error-display',
  templateUrl: './api-error-display.component.html',
  styleUrls: ['./api-error-display.component.css']
})
export class ApiErrorDisplayComponent implements OnInit {
  @Input() error = null;

  constructor() { }

  ngOnInit() {
  }

}
