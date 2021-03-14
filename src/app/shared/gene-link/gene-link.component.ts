import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { PopoverDirective } from 'ngx-bootstrap/popover';
import { getAppConfig } from '../../config';

@Component({
  selector: 'app-gene-link',
  templateUrl: './gene-link.component.html',
  styleUrls: ['./gene-link.component.css']
})
export class GeneLinkComponent implements OnInit {
  @Input() gene: /* GeneShort */ any;
  @Input() long = true;

  @ViewChild('link', {static: false}) link: PopoverDirective;

  mouseIn = false;

  displayString = '';
  nameAndId = '';
  product = '';

  appConfig = getAppConfig();

  constructor() { }

  mouseEnter(): void {
    this.mouseIn = true;
    setTimeout(() => {
      if (this.mouseIn && this.link) {
        this.link.show();
      }
    }, this.appConfig.details_popup_delay);

  }

  mouseLeave(): void {
    this.mouseIn = false;
    this.link.hide();
  }

  ngOnDestroy(): void {
    this.link.hide();
    this.mouseIn = false;
  }

  ngOnInit() {
    if (this.gene.name) {
      this.nameAndId = this.gene.name + ' (' + this.gene.uniquename + ')';

      if (this.long) {
        this.displayString = this.nameAndId;
      } else {
        this.displayString = this.gene.name;
      }
    } else {
      this.displayString = this.gene.uniquename;
      this.nameAndId = this.gene.uniquename;
    }

    if (this.gene.product) {
      this.product = this.gene.product;
    }
  }
}
