import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-router-not-found-handler',
  templateUrl: './router-not-found-handler.component.html',
  styleUrls: ['./router-not-found-handler.component.css']
})
export class RouterNotFoundHandlerComponent implements OnInit {
  path = '';

  constructor(private router: Router) { }

  ngOnInit() {
    this.path = this.router.url;
  }
}
