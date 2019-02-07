import { OnInit, Directive, Renderer, ElementRef } from '@angular/core';

@Directive({
  selector: '[appGetFocus]'
})
export class GetFocusDirective implements OnInit {
  constructor(public renderer: Renderer, public elementRef: ElementRef) {}

  ngOnInit() {
    this.renderer.invokeElementMethod(this.elementRef.nativeElement, 'focus', []);
  }
}
