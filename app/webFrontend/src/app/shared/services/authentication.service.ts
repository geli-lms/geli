import {Injectable} from '@angular/core';
import {Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {UserService} from './user.service';
import {Http} from '@angular/http';
import {IUser} from '../../../../../../shared/models/IUser';
import {Router} from '@angular/router';

@Injectable()
export class AuthenticationService {

  public static readonly API_URL = '/api/';

  public token: string;
  public isLoggedIn = false;

  constructor(private http: Http,
              private router: Router,
              private userService: UserService) {
    this.token = localStorage.getItem('token');

    this.isLoggedIn = this.token !== null;
  }

  login(email: string, password: string) {
    return new Promise((resolve, reject) => {

      return this.http.post(AuthenticationService.API_URL + 'auth/login', {email: email, password: password})
      .map(response => response.json())
      .subscribe(
        (response: any) => {
          this.userService.setUser(response.user);
          this.token = response.token;
          this.isLoggedIn = true;
          localStorage.setItem('token', this.token);

          resolve();
        }, (err) => {
          reject(err);
        });
    });
  }

  reloadUser() {
    if (this.isLoggedIn && this.userService.user) {
      return this.http.get(`${AuthenticationService.API_URL}users/${this.userService.user._id}`, {headers: this.authHeader()})
      .map(response => response.json())
      .subscribe(
        (response: any) => {
          this.userService.setUser(response);
        }, () => {
          this.logout();
        });
    }
  }

  unsetAuthData() {
    this.token = null;
    this.isLoggedIn = false;
    localStorage.removeItem('token');

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
        (json: any) => {
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
        (json: any) => {
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
        (json: any) => {
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
    const headers = new Headers({'Content-Type': 'application/json'});
    if (this.token !== '') {
      headers.set('Authorization', this.token);
    }
    return headers;
  }
}
