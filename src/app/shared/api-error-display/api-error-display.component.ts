import { Component, OnInit, Input } from '@angular/core';
import { APIError } from '../../pombase-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-api-error-display',
  templateUrl: './api-error-display.component.html',
  styleUrls: ['./api-error-display.component.css']
})
export class ApiErrorDisplayComponent implements OnInit {
  @Input() error: APIError;

  path: string;

  constructor(private router: Router) { }

  ngOnInit() {
    this.path = this.router.url;
  }

}
