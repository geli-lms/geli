import {Component, Input, OnInit} from '@angular/core';
import {IUser} from '../../../../../../shared/models/IUser';
import {UserService} from '../../shared/services/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  @Input() userId: String;
  @Input() user: IUser;

  constructor(public userService: UserService) { }

  ngOnInit() {
  }

  isCurrentProfile() {
    return this.userId === this.user._id;
  }
}
