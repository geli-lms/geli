import { Component, OnInit } from '@angular/core';
import {UserDataService} from '../../shared/data.service';
import {Router} from '@angular/router';
import {User} from '../../models/user';
import {UserService} from '../../shared/user.service';
import {AuthenticationService} from "../../shared/authentification.service";

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {

  user: User;

  constructor(private authenticationService: AuthenticationService,
              private userDataService: UserDataService,
              private router: Router) {
    if(this.router.url === '/profile') {
      var decodedToken = this.authenticationService.getDecodedToken();
      this.getUser(decodedToken._id);
    }
  }

  ngOnInit() {
  }

  getUser(userId: string) {
    this.userDataService.readSingleItem(userId).then(user => {
      this.user = user[0];
    });
  }

}
