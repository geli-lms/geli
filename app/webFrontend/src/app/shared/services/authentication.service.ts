import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {UserService} from './user.service';
import {MdSnackBar} from '@angular/material';
import {Http} from '@angular/http';
import {IUser} from '../../../../../../shared/models/IUser';

@Injectable()
export class AuthenticationService {

  public static readonly API_URL = '/api/';

  public token: string;
  public isLoggedIn = false;

  constructor(private http: Http,
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

  logout(): void {
    this.token = null;
    this.isLoggedIn = false;
    localStorage.removeItem('token');

    this.userService.unsetUser();
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
}
