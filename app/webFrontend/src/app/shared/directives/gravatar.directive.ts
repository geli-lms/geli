/**
 * Created by olineff on 27.05.2017.
 */
import {Directive, HostBinding, Input, OnInit} from '@angular/core';
import md5 from 'blueimp-md5';

@Directive({selector: '[grav]'})
export class GravatarDirective implements OnInit {

  @Input('grav') email = '';
  @Input('size') size = 30;

  @HostBinding('style.backgroundImage')
  backgroundImage: string;

  @HostBinding('style.width')
  width: string;

  @HostBinding('style.height')
  height: string;

  @HostBinding('style.border-radius')
  borderRadius: string;

  constructor() {}

  ngOnInit(): void {
    this.backgroundImage = 'url(' + 'https://www.gravatar.com/avatar/'
      + md5(this.email.toLowerCase())
      + '.jpg?s=' + this.size + ')';
    this.width = this.size.toString() + 'px';
    this.height = this.size.toString() + 'px';
    this.borderRadius = (this.size / 2).toString() + 'px';
  }
}
