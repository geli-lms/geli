import {Directive, HostBinding, Input, OnInit, SimpleChange} from '@angular/core';
import {DomSanitizer, SafeStyle} from '@angular/platform-browser';
import {IUser} from '../../../../../../shared/models/IUser';
import {BackendService} from '../services/backend.service';

const md5 = require('blueimp-md5');

@Directive({selector: '[user-image]'})
export class UserImageDirective implements OnInit {

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

  constructor(private backendService: BackendService, private domSanitizer: DomSanitizer) {
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

  getGravatarURL(size: number = 80) {
      // Gravatar wants us to hash the email (for site to site consistency),
      // - see https://en.gravatar.com/site/implement/hash/ -
      // but we don't do that (anymore) for the sake of security & privacy.
      return `https://www.gravatar.com/avatar/${md5(this.user._id)}.jpg?s=${size}&d=retro`;
  }

  async getUserImageURL(size: number = 80) {
    const profile = this.user.profile;
    if (profile && profile.picture) {
      const urlPart = 'uploads/users/' + profile.picture.name;
      const response = await this.backendService.getDownload(urlPart).toPromise();
      URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = URL.createObjectURL(response.body);
      return this.objectUrl;
    } else {
      return this.getGravatarURL(size);
    }
  }

  async updateImage() {
    if (this.user) {
      this.width = this.size;
      this.height = this.size;
      this.borderRadius = '50%';
      // FIXME: Supply the image pixel size to getUserImage for the gravatar path.
      const url = await this.getUserImageURL();
      this.backgroundImage = this.domSanitizer.bypassSecurityTrustStyle(`url(${url})`);
    }
  }

}
