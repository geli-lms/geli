
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {UserService} from './user.service';
import {IUser} from '../../../../../../shared/models/IUser';

@Injectable()
export class AuthenticationService {

  public static readonly API_URL = '/api/';

  public isLoggedIn: Boolean = false;

  constructor(private http: HttpClient,
              private router: Router,
              private userService: UserService) {
    // Currently 'isLoggedIn' in localStorage could be replaced by checking for 'user' (userService.user).
    this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  }

  async login(email: string, password: string) {
    return new Promise((resolve, reject) => {

      return this.http.post(AuthenticationService.API_URL + 'auth/login', {email: email, password: password})
      .subscribe(
        (response) => {
          this.isLoggedIn = true;
          localStorage.setItem('isLoggedIn', 'true');

          this.userService.setUser(response['user']);

          resolve();
        }, (err) => {
          reject(err);
        });
    });
  }

  reloadUser() {
    if (this.isLoggedIn && this.userService.user) {
      return this.http.get<IUser>(`${AuthenticationService.API_URL}users/${this.userService.user._id}`)
      .subscribe(
        (response) => {
          this.userService.setUser(response);
        }, () => {
          this.logout();
        });
    }
  }

  unsetAuthData() {
    this.isLoggedIn = false;
    localStorage.removeItem('isLoggedIn');
    this.userService.unsetUser();
    this.http.delete(AuthenticationService.API_URL + 'auth/logout').toPromise();
  }

  logout(): void {
    this.unsetAuthData();
    this.router.navigate(['login']);
  }

  register(user: IUser) {

    return new Promise((resolve, reject) => {

      return this.http.post(
        AuthenticationService.API_URL + 'auth/register',
        user
      )
      .subscribe(
        (json) => {
          resolve();
        }, (err) => {
          reject(err);
        });
    });

  }

  resendActivation(lastname: string, uid: string, email: string) {
    return new Promise((resolve, reject) => {

      return this.http.post(
        AuthenticationService.API_URL + 'auth/activationresend',
        {lastname: lastname,
                uid: uid,
                email: email}
      )
        .subscribe(
          (json) => {
            resolve();
          }, (err) => {
            reject(err);
          });
    });

  }

  activate(token: string) {
    return new Promise((resolve, reject) => {

      return this.http.post(
        AuthenticationService.API_URL + 'auth/activate',
        {authenticationToken: token}
      )
      .subscribe(
        (json) => {
          resolve();
        }, (err) => {
          reject(err);
        });
    });
  }

  requestReset(email: string) {
    return new Promise((resolve, reject) => {

      return this.http.post(
        AuthenticationService.API_URL + 'auth/requestreset',
        {email: email}
      )
      .subscribe(
        (json) => {
          resolve();
        }, (err) => {
          reject(err);
        });
    });
  }

  resetPassword(resetPasswordToken: string, newPassword: string) {
    return new Promise((resolve, reject) => {

      return this.http.post(
        AuthenticationService.API_URL + 'auth/reset',
        {
          resetPasswordToken: resetPasswordToken,
          newPassword: newPassword
        }
      )
      .subscribe(
        (json: any) => {
          resolve();
        }, (err) => {
          reject(err);
        });
    });
  }
}
