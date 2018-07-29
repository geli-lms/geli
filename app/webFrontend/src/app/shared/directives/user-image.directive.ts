import {Directive, HostBinding, Input, OnInit, OnDestroy, SimpleChange} from '@angular/core';
import {DomSanitizer, SafeStyle} from '@angular/platform-browser';
import {IUser} from '../../../../../../shared/models/IUser';
import {User} from '../../models/User';
import {JwtPipe} from '../pipes/jwt/jwt.pipe';

@Directive({selector: '[user-image]'})
export class UserImageDirective implements OnInit, OnDestroy {

  @Input('user-image') user: IUser;
  @Input('size') size = '100%';

  @HostBinding('style.backgroundImage')
  backgroundImage: SafeStyle;

  @HostBinding('style.width')
  width: string;

  @HostBinding('style.height')
  height: string;

  @HostBinding('style.border-radius')
  borderRadius: string;

  private objectUrl: string;

  constructor(private jwtPipe: JwtPipe, private domSanitizer: DomSanitizer) {
  }

  async ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        const changedProp = changes[propName];
        this[propName] = changedProp.currentValue;
      }
    }
    await this.updateImage();
  }

  async ngOnInit() {
    await this.updateImage();
  }

  ngOnDestroy() {
    URL.revokeObjectURL(this.objectUrl);
  }

  async updateImage() {
    if (this.user) {
      this.width = this.size;
      this.height = this.size;
      this.borderRadius = '50%';

      const user = new User(this.user);
      // TODO: Provide a way to supply the image pixel size to user.getUserImageURL for the gravatar path.
      let url = user.getUserImageURL();
      if (user.hasUploadedProfilePicture) {
        url = this.jwtPipe.transform(url);
      }
      this.backgroundImage = this.domSanitizer.bypassSecurityTrustStyle(`url(${url})`);
    }
  }

}
