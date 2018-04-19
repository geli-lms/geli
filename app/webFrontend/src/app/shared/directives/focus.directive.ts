import { Directive, OnInit, ElementRef } from '@angular/core';

@Directive({
  selector: '[focus]'
})
export class FocusDirective implements OnInit {

  constructor(private elementRef: ElementRef) { }

  ngOnInit(): void {
    // set directly so the changeDetector knows it's set to true later
    this.elementRef.nativeElement.focus();
  }

  ngAfterViewInit(): void {
    // fugly hack
    setTimeout(() => this.elementRef.nativeElement.focus(), 500);
  }

}
