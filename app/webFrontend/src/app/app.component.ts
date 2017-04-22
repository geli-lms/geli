import { Component } from '@angular/core';
import {UserService} from './shared/user.service';
import {AuthenticationService} from './shared/authentification.service';
import {ShowProgressService} from './shared/show-progress.service';

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

  logout(): void {
    this.loggedIn = false;
    this.authService.logout();
  }
}
