import {Component, OnInit} from '@angular/core';
import {UserService} from './shared/services/user.service';
import {AuthenticationService} from './shared/services/authentication.service';
import {ShowProgressService} from './shared/services/show-progress.service';
import {Router} from '@angular/router';
import {APIInfoService} from './shared/services/data.service';
import {APIInfo} from './models/APIInfo';
import {isNullOrUndefined} from 'util';
import {RavenErrorHandler} from './shared/services/raven-error-handler.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'app works!';
  showProgressBar = false;
  apiInfo: APIInfo;

  constructor(private router: Router,
              private authenticationService: AuthenticationService,
              public userService: UserService,
              private showProgress: ShowProgressService,
              private apiInfoService: APIInfoService,
              private ravenErrorHandler: RavenErrorHandler
  ) {
    showProgress.toggleSidenav$.subscribe(
      toggle => {
        this.toggleProgressBar();
      }
    );
  }

  ngOnInit(): void {
    this.authenticationService.reloadUser();
    this.apiInfoService.readItems()
    .then((info: any) => {
      this.ravenErrorHandler.setup(info.sentryDsn);
      this.apiInfo = info;
    })
    .catch((err) => {
      // FIXME: Add Snackbar here
    });
  }

  hasWarning() {
    return !isNullOrUndefined(this.apiInfo) && !isNullOrUndefined(this.apiInfo.nonProductionWarning);
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
