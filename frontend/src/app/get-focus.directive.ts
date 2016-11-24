import { Directive, Renderer, ElementRef } from '@angular/core';

@Directive({
  selector: '[appGetFocus]'
})
export class GetFocusDirective {
  constructor(public renderer: Renderer, public elementRef: ElementRef) {}

  ngOnInit() {
    this.renderer.invokeElementMethod(this.elementRef.nativeElement, 'focus', []);
  }
}
