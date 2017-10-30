import {Directive, HostBinding, Input, OnInit} from '@angular/core';
import {IUser} from '../../../../../../shared/models/IUser';
import md5 from 'blueimp-md5';

@Directive({selector: '[user-image]'})
export class UserImageDirective implements OnInit {

  @Input('user-image') user: IUser;
  @Input('size') size = 160;

  @HostBinding('style.backgroundImage')
  backgroundImage: string;

  @HostBinding('style.width')
  width: string;

  @HostBinding('style.height')
  height: string;

  @HostBinding('style.border-radius')
  borderRadius: string;

  constructor() {
  }

  ngOnInit(): void {
    let backgroundImageUrl = 'url(';
    if (this.user.profile.hasOwnProperty('picture')) {
      backgroundImageUrl += '/api/uploads/users/'
        + this.user.profile.picture.name;
    } else {
      backgroundImageUrl += 'https://www.gravatar.com/avatar/'
        + md5(this.user.email.toLowerCase())
        + '.jpg?s=' + this.size;
    }
    backgroundImageUrl += ')';
    this.backgroundImage = backgroundImageUrl;
    this.width = this.size.toString() + 'px';
    this.height = this.size.toString() + 'px';
    this.borderRadius = (this.size / 2).toString() + 'px';
  }

}
