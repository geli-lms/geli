import {Component, Input, OnInit} from '@angular/core';
import {AuthenticationService} from '../shared/services/authentication.service';
import {UserService} from '../shared/services/user.service';
import {IPage} from '../../../../../shared/models/IPage';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent implements OnInit {

  @Input()
  menuPages: IPage[];

  constructor(private authenticationService: AuthenticationService,
              private userService: UserService) { }

  ngOnInit() {
  }

  isLoggedIn() {
    return this.authenticationService.isLoggedIn;
  }

  isAdmin(): boolean {
    return this.userService.isAdmin();
  }

  isStudent(): boolean {
    return this.userService.isStudent();
  }
}
