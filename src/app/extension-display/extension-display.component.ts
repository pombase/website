import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-extension-display',
  templateUrl: './extension-display.component.html',
  styleUrls: ['./extension-display.component.css']
})
export class ExtensionDisplayComponent implements OnInit {
  @Input() extension = [];

  displayString = "";

  constructor() { }

  ngOnInit() {
    this.displayString =
      this.extension.map((part) => part.rel_type_name + "(" + part.ext_range + ")").join(", ");
  }

}
