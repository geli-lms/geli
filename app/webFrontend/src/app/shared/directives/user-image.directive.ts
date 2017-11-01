import {Directive, HostBinding, Input, OnInit} from '@angular/core';
import {IUser} from '../../../../../../shared/models/IUser';
import md5 from 'blueimp-md5';
import {User} from '../../models/User';

@Directive({selector: '[user-image]'})
export class UserImageDirective implements OnInit {

  @Input('user-image') user: User;
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
    this.backgroundImage = `url(${this.user.getUserImageURL()})`;
    this.width = this.size.toString() + 'px';
    this.height = this.size.toString() + 'px';
    this.borderRadius = (this.size / 2).toString() + 'px';
  }

}
