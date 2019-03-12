import {Directive, Injectable, Input, EventEmitter, Output, ElementRef, HostListener} from '@angular/core';

// Taken from https://stackblitz.com/edit/angular-scroll-spy

@Directive({
  selector: '[scrollSpy]'
})
export class ScrollSpyDirective {
  @Input() public spiedTags = [];
  @Input() public parentContainer: ElementRef;
  @Output() public sectionChange = new EventEmitter<string>();
  private currentSection: any;

  constructor(private _el: ElementRef) {
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: any) {
    let currentSection: string;
    const windowScroll = window.pageYOffset;

    const children = this._el.nativeElement.children;
    const scrollTop = 0; // this._el.nativeElement.scrollTop;
    const parentOffset = 0; // this._el.nativeElement.offsetTop;
    for (let i = children.length - 1; i >= 0; i--) {
      const element = children[i];
      if (this.spiedTags.some(spiedTag => spiedTag === element.tagName)) {
        if (this.getPosition(element).y <= windowScroll + scrollTop) {
          currentSection = element.id;
          break;
        }
      }
    }


    if (currentSection !== this.currentSection) {
      this.currentSection = currentSection;
      this.sectionChange.emit(this.currentSection);
    }
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
