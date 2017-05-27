/**
 * Created by olineff on 27.05.2017.
 */
import {Directive, ElementRef, Input} from '@angular/core';
import md5 from 'blueimp-md5';

@Directive({selector: '[grav]'})
export class GravatarDirective {

  @Input('grav') email: String = '';
  @Input('size') size: Number = 160;

  constructor(el: ElementRef) {
    el.nativeElement.style.backgroundImage = 'url(' + 'https://www.gravatar.com/avatar/'
      + md5(this.email.toLowerCase())
      + '.jpg?s=' + this.size + ')';
    el.nativeElement.style.width = this.size;
    el.nativeElement.style.height = this.size;
    console.log(this.size);
  }
}
