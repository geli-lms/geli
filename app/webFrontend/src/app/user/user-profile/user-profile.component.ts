import {Component, Input, OnInit} from '@angular/core';
import {UserService} from '../../shared/services/user.service';
import {IFile} from '../../../../../../shared/models/IFile';
import {User} from '../../models/User';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  @Input() userId: String;
  @Input() user: User;

  picture: IFile;

  constructor(public userService: UserService) { }

  ngOnInit() {
    if (this.hasCustomPicture()) {
      this.picture = this.user.profile.picture;
    }
  }

  isCurrentProfile() {
    return this.userId === this.user._id;
  }

  hasCustomPicture() {
    return this.user.profile.hasOwnProperty('picture');
  }

  canSeeUid() {
    return (this.userService.isAdmin() || this.userService.isTeacher() ||
      this.userService.user._id === this.user._id) && this.user.uid;
  }
}
