import {Component, OnInit} from '@angular/core';
import {UserService} from './shared/services/user.service';
import {AuthenticationService} from './shared/services/authentication.service';
import {ShowProgressService} from './shared/services/show-progress.service';
import {Router} from '@angular/router';
import {InfoService} from './shared/services/data.service';
import {Info} from './models/Info';
import {isNullOrUndefined} from 'util';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'app works!';
  showProgressBar = false;
  info: Info;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    public userService: UserService,
    private showProgress: ShowProgressService,
    private infoService: InfoService
  ) {
    showProgress.toggleSidenav$.subscribe(
      toggle => {
        this.toggleProgressBar();
      }
    );
  }

  ngOnInit(): void {
    this.authenticationService.reloadUser();
    this.infoService.readItems()
      .then((info: any) => {
        this.info = info;
      })
      .catch((err) => console.log(err));
  }

  hasWarning() {
    return !isNullOrUndefined(this.info) && !isNullOrUndefined(this.info.nonProductionWarning);
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
