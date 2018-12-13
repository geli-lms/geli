import {Component, OnInit} from '@angular/core';
import {UserService} from './shared/services/user.service';
import {AuthenticationService} from './shared/services/authentication.service';
import {ShowProgressService} from './shared/services/show-progress.service';
import {Router} from '@angular/router';
import {APIInfoService} from './shared/services/data.service';
import {APIInfo} from './models/APIInfo';
import {isNullOrUndefined} from 'util';
import {RavenErrorHandler} from './shared/services/raven-error-handler.service';
import {ThemeService} from './shared/services/theme.service';
import {TranslateService} from '@ngx-translate/core';
import {DomSanitizer, SafeStyle} from '@angular/platform-browser';
import {TranslatableSnackBarServiceService} from './shared/services/translatable-snack-bar-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'app works!';
  showProgressBar = false;
  apiInfo: APIInfo;
  avatarBackgroundImage: SafeStyle | undefined;

  constructor(private router: Router,
              private authenticationService: AuthenticationService,
              public userService: UserService,
              private showProgress: ShowProgressService,
              private apiInfoService: APIInfoService,
              private ravenErrorHandler: RavenErrorHandler,
              private snackBar: TranslatableSnackBarServiceService,
              private themeService: ThemeService,
              public translate: TranslateService,
              private domSanitizer: DomSanitizer) {
    translate.setDefaultLang('en');

    showProgress.toggleSidenav$.subscribe(toggle => {
      this.toggleProgressBar();
    });
  }

  ngOnInit(): void {
    const lang = localStorage.getItem('lang') || this.translate.getBrowserLang() || this.translate.getDefaultLang();
    this.translate.use(lang);

    this.authenticationService.reloadUser();

    this.apiInfoService.readAPIInfo()
      .then((info: any) => {
        this.ravenErrorHandler.setup(info.sentryDsn);
        this.apiInfo = info;
      })
      .catch((err) => {
        this.snackBar.open(['home.backendError'], {err: err.error}, null);
      });

    this.updateCurrentUser();

    this.userService.data.subscribe(actualProfilePicturePath => {
      if (actualProfilePicturePath === undefined && this.userService.user.profile.picture) {
        actualProfilePicturePath = this.userService.user.profile.picture.path;
      }
      if (actualProfilePicturePath === undefined || actualProfilePicturePath === '') {
        this.avatarBackgroundImage = undefined;
        return;
      }

      actualProfilePicturePath = '/api/' + actualProfilePicturePath;
      this.avatarBackgroundImage = this.domSanitizer.bypassSecurityTrustStyle(`url(${actualProfilePicturePath})`);
    });
  }

  updateCurrentUser() {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      this.userService.setUser(storedUser);
    }
  }

  changeLanguage(lang: string) {
    localStorage.setItem('lang', lang);
    this.translate.use(lang);
  }

  hasWarning() {
    return !isNullOrUndefined(this.apiInfo) && !isNullOrUndefined(this.apiInfo.nonProductionWarning);
  }

  isLoggedIn() {
    return this.authenticationService.isLoggedIn;
  }

  logout() {
    delete this.avatarBackgroundImage;
    this.authenticationService.logout();
  }

  toggleProgressBar() {
    this.showProgressBar = !this.showProgressBar;
  }

  isAdmin(): boolean {
    return this.userService.isAdmin();
  }

  isStudent(): boolean {
    return this.userService.isStudent();
  }

  specialContainerStyle(): string {
    const routeTest = /^(\/|\/login|\/register|\/reset|\/activation-resend)$/.test(this.router.url);

    return (routeTest && !this.isLoggedIn()) ? 'special-style' : '';
  }

  contentStyle(): string {
    let style = 'app-content';
    // Don't add padding when displaying non-plaintext files such as PDFs via a FileComponent.
    const routeTest = /^\/file/.test(this.router.url);
    if (!routeTest) {
      style += ' app-content-padding';
    }
    return style;
  }
}
