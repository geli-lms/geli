import {Directive, HostBinding, Input, OnInit} from '@angular/core';
import {User} from '../../models/User';
import {IUser} from '../../../../../../shared/models/IUser';

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
    const user = new User(this.user);
    this.backgroundImage = `url(${user.getUserImageURL()})`;
    this.width = this.size.toString() + 'px';
    this.height = this.size.toString() + 'px';
    this.borderRadius = (this.size / 2).toString() + 'px';
  }

}
