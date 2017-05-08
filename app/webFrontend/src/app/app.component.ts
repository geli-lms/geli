import {Component} from '@angular/core';
import {UserService} from './shared/user.service';
import {ShowProgressService} from './shared/show-progress.service';
import {AuthenticationService} from './shared/authentication.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app works!';
  showProgressBar = false;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    public userService: UserService,
    private showProgress: ShowProgressService
  ) {
    showProgress.toggleSidenav$.subscribe(
      toggle => {
        this.toggleProgressBar();
      }
    );
  }

  isLoggedIn() {
    return this.authenticationService.isLoggedIn;
  }

  logout() {
    this.authenticationService.logout();
  }

  toggleProgressBar() {
    this.showProgressBar = !this.showProgressBar;
  }

  isAdmin(): boolean {
    return this.userService.isAdmin();
  }

  specialContainerStyle(): string {
    const routeTest = /^(\/|\/login|\/register)$/.test(this.router.url);

    return (routeTest && !this.isLoggedIn()) ? 'special-style' : '';
  }
}
