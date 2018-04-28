import {Directive, HostBinding, Input, OnInit, SimpleChange} from '@angular/core';
import {User} from '../../models/User';
import {IUser} from '../../../../../../shared/models/IUser';

@Directive({selector: '[user-image]'})
export class UserImageDirective implements OnInit {

  @Input('user-image') user: IUser;
  @Input('size') size = '100%';

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

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        const changedProp = changes[propName];
        this[propName] = changedProp.currentValue;
      }
    }
    this.getImage();
  }

  ngOnInit(): void {
    this.getImage();
  }

  getImage() {
    if (this.user) {
      const user = new User(this.user);
      this.backgroundImage = `url(${user.getUserImageURL()})`;
      this.width = this.size;
      this.height = this.size;
      this.borderRadius = '50%';
    }
  }

}
