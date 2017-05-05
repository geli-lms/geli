import { Component } from '@angular/core';
import {UserService} from './shared/services/user.service';
import {AuthenticationService} from './shared/services/authentification.service';
import {ShowProgressService} from './shared/services/show-progress.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';
  loggedIn = false;

  showProgressBar = false;

  constructor(private userService: UserService, private authService: AuthenticationService, private showProgress: ShowProgressService) {
    // localStorage.clear();
      showProgress.toggleSidenav$.subscribe(
          toggle => {
              this.toggleProgressBar();
          }
      );
  }

  toggleProgressBar() {
    if (this.showProgressBar === true) {
      this.showProgressBar = false;
    } else {
      this.showProgressBar = true;
    }
  }

  isLoggedIn(): boolean {
    if (this.userService.getCurrentUserName()) {
      this.loggedIn = true;
    }
    return this.loggedIn;
  }

  isAdmin(): boolean {
    return this.userService.isAdmin();
  }

  logout(): void {
    this.loggedIn = false;
    this.authService.logout();
  }
}
