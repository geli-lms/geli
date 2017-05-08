import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {UserService} from './user.service';
import {MdSnackBar} from '@angular/material';
import {Http} from '@angular/http';

@Injectable()
export class AuthenticationService {

  public static readonly API_URL: string = '/api/';

  public token: string;
  public isLoggedIn = false;

  constructor(private http: Http,
              private userService: UserService,
              private snackBar: MdSnackBar) {
    this.token = localStorage.getItem('token');

    this.isLoggedIn = this.token !== null;
  }

  login(username: string, password: string) {
    return new Promise((resolve, reject) => {

      return this.http.post(AuthenticationService.API_URL + 'auth/login', {email: username, password: password})
        .map(response => response.json())
        .subscribe(
          (response: any) => {
            this.userService.setUser(response.user);
            this.token = response.token;
            this.isLoggedIn = true;
            localStorage.setItem('token', this.token);

            this.snackBar.open('Successfully logged in!', '', {  duration: 2000 });
            resolve();
          }, (err) => {
            this.snackBar.open('Error logging in!');
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

  register(prename: string, surname: string, username: string, email: string, password: string) {

    return new Promise((resolve, reject) => {

      return this.http.post(
        AuthenticationService.API_URL + 'auth/register',
        {
          email: email,
          username: username,
          password: password,
          profile: {
            firstName: prename,
            lastName: surname
          },
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
