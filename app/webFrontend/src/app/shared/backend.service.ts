import {Injectable} from '@angular/core';
import {Http, Headers, Response} from '@angular/http';

import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import {AuthenticationService} from './authentication.service';

@Injectable()
export class BackendService {

  public static readonly API_URL = '/api/';

  constructor(private http: Http, private authenticationService: AuthenticationService) {
  }

  authHeader(): Headers {
    const headers = new Headers({'Content-Type': 'application/json'});
    if (this.authenticationService.token !== '') {
      headers.set('Authorization', this.authenticationService.token);
    }
    return headers;
  }

  get(serviceUrl: string): Observable<Response> {
    return this.http.get(BackendService.API_URL + serviceUrl, {headers: this.authHeader()})
      .map(response => response.json());
  }

  post(serviceUrl: string, options: any): Observable<Response> {
    return this.http.post(BackendService.API_URL + serviceUrl, options, {headers: this.authHeader()})
      .map(response => response.json());
  }

  put(serviceUrl: string, options: any): Observable<Response> {

    return this.http.put(BackendService.API_URL + serviceUrl, options, {headers: this.authHeader()})
      .map(response => response.json());

  }

  delete(serviceUrl: string): Observable<Response> {
    return this.http.delete(BackendService.API_URL + serviceUrl, {headers: this.authHeader()})
      .map(response => response.json());

  }

  onBeforeUpload(event: any, id: string, extension: string) {
    event.xhr.setRequestHeader('Authorization', this.authenticationService.token);
    event.xhr.setRequestHeader('uploadfilename', id + '.' + extension);
  }
}
