import {Component, OnInit} from '@angular/core';
import {IUser} from '../../../../../../shared/models/IUser';
import {UserDataService} from '../../shared/services/data.service';
import {ActivatedRoute} from '@angular/router';
import {UserService} from '../../shared/services/user.service';
import {User} from '../../models/User';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {

  userId: string;
  user: IUser;

  constructor(private route: ActivatedRoute,
              public userService: UserService,
              public userDataService: UserDataService) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.userId = decodeURIComponent(params['id']);

      if (this.userId === 'undefined') {
        this.userId = this.userService.user._id;
      }
    });
    this.getUserData();
  }

  getUserData() {
    this.userDataService.readSingleItem(this.userId)
      .then((user: any) => {
        this.user = new User(user);
      })
      .catch((error: any) => {
      });
  }
}
