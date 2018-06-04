import {Directive, HostBinding, Input, OnInit, SimpleChange} from '@angular/core';
import {DomSanitizer, SafeStyle} from '@angular/platform-browser';
import {User} from '../../models/User';
import {IUser} from '../../../../../../shared/models/IUser';
import {BackendService} from '../services/backend.service';

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

  ngOnDestroy() {
    URL.revokeObjectURL(this.objectUrl);
  }

  getImage() {
    // FIXME maybe refactor this 'if' to an early exit?
    if (this.user) {
      // FIXME is the following line actually required?
      const user = new User(this.user);
      this.width = this.size;
      this.height = this.size;
      this.borderRadius = '50%';
      // FIXME change this to async await?
      this.backendService.getDownload(user.getUserImageURL()).toPromise().then(response => {
        // FIXME error handling?
        URL.revokeObjectURL(this.objectUrl);
        this.objectUrl = URL.createObjectURL(response.body);
        this.backgroundImage = this.domSanitizer.bypassSecurityTrustStyle(`url(${this.objectUrl})`);
      });
    }
  }

}
