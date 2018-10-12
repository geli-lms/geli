import {Injectable} from '@angular/core';
import {HttpHeaders} from '@angular/common/http';

import {UserService} from './user.service';
import {HttpClient} from '@angular/common/http';
import {IUser} from '../../../../../../shared/models/IUser';
import {Router} from '@angular/router';
import {isNullOrUndefined} from 'util';

@Injectable()
export class AuthenticationService {

  public static readonly API_URL = '/api/';

  public token: string;
  public mediaToken: string;
  public isLoggedIn = false;

  constructor(private http: HttpClient,
              private router: Router,
              private userService: UserService) {
    this.token = localStorage.getItem('token');
    this.mediaToken = localStorage.getItem('mediaToken');
    if (isNullOrUndefined(this.token)) {
      this.token = '';
    }
    if (isNullOrUndefined(this.mediaToken)) {
      this.mediaToken = '';
    }
    this.isLoggedIn = this.token !== ''; // Not checking against the mediaToken, because the app may still be partly functional without it.
  }

  async login(email: string, password: string) {
    return new Promise((resolve, reject) => {

      return this.http.post(AuthenticationService.API_URL + 'auth/login', {email: email, password: password})
      .subscribe(
        (response) => {
          // See JwtUtils.ts (generateToken function) in the back-end API for a description of the mediaToken's purpose.
          // To easily attach the mediaToken to an URL you can use the jwt.pipe.ts (e.g. 'some/url/file.png | jwt').
          this.token = response['token'];
          this.mediaToken = response['mediaToken'];
          localStorage.setItem('token', this.token);
          localStorage.setItem('mediaToken', this.mediaToken);
          this.isLoggedIn = true;

          this.userService.setUser(response['user']);

          resolve();
        }, (err) => {
          reject(err);
        });
    });
  }

  reloadUser() {
    if (this.isLoggedIn && this.userService.user) {
      return this.http.get<IUser>(`${AuthenticationService.API_URL}users/${this.userService.user._id}`, {headers: this.authHeader()})
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
    this.token = null;
    this.mediaToken = null;
    localStorage.removeItem('token');
    localStorage.removeItem('mediaToken');

    this.userService.unsetUser();
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

  authHeader() {
    let headers = new HttpHeaders({'Content-Type': 'application/json'});
    if (this.token) {
      headers = headers.append('Authorization', this.token);
    }
    return headers;
  }
}
