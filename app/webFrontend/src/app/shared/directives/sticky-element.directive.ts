import {Directive, OnInit, ElementRef, Input, HostListener, HostBinding} from '@angular/core';

@Directive({
  selector: '[stickyElement]'
})
export class StickyElementDirective implements OnInit {
  @Input('anchor') anchorElement: HTMLElement | undefined;

  private anchorPosition: number;

  @HostBinding('class.is-sticky') sticky = false;

  constructor(private elementRef: ElementRef) {
  }


  ngOnInit(): void {
    // set directly so the changeDetector knows it's set to true later
    // this.elementRef.nativeElement.focus();
  }

  @HostListener('window:scroll', ['$event'])
  handleScroll() {
    const windowScroll = window.pageYOffset;

    if (windowScroll >= this.anchorPosition) {
      this.sticky = true;
    } else {
      this.sticky = false;
    }
  }


  ngAfterViewInit(): void {
    this.anchorPosition = this.getPosition(this.anchorElement).y;
  }

  getPosition(el) {
    let top = 0;
    let left = 0;
    let element = el;

    // Loop through the DOM tree
    // and add it's parent's offset to get page offset
    do {
      top += element.offsetTop || 0;
      left += element.offsetLeft || 0;
      element = element.offsetParent;
    } while (element);

    return {
      y: top,
      x: left,
    };
  }

}
