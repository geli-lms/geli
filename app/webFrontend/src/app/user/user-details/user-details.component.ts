import { Component, OnInit } from '@angular/core';
import {UserService} from '../../shared/services/user.service';
import {IUser} from '../../../../../../shared/models/IUser';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {

  user: IUser;

  constructor(public userService: UserService) {}

  ngOnInit() {
    this.user = this.userService.user;
  }
}
