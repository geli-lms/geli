
import {throwError as observableThrowError, Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';




import {AuthenticationService} from './authentication.service';
import {catchError} from 'rxjs/operators';

@Injectable()
export class BackendService {

  public static readonly API_URL = '/api/';

  constructor(private http: HttpClient, private authenticationService: AuthenticationService) {
  }

  private handleUnauthorized = (err) => {
    if (err.status === 401) {
      this.authenticationService.logout();
      return Observable.empty();
    }

    return observableThrowError(err);
  }

  get(serviceUrl: string): Observable<any> {
    return this.http.get(BackendService.API_URL + serviceUrl, {headers: this.authenticationService.authHeader()})
      .pipe(catchError(this.handleUnauthorized));
  }

  getDownload(serviceUrl: string): Observable<Response> {
    return this.http.get(BackendService.API_URL + serviceUrl, {headers: this.authenticationService.authHeader(),
      observe: 'response', responseType: 'blob'})
      .pipe(catchError(this.handleUnauthorized));
  }

  post(serviceUrl: string, options: any): Observable<any> {
    return this.http.post(BackendService.API_URL + serviceUrl, options, {headers: this.authenticationService.authHeader()})
      .pipe(catchError(this.handleUnauthorized));
  }

  put(serviceUrl: string, options: any): Observable<any> {
    return this.http.put(BackendService.API_URL + serviceUrl, options, {headers: this.authenticationService.authHeader()})
      .pipe(catchError(this.handleUnauthorized));
  }

  delete(serviceUrl: string): Observable<any> {
    return this.http.delete(BackendService.API_URL + serviceUrl, {headers: this.authenticationService.authHeader()})
      .pipe(catchError(this.handleUnauthorized));

  }

  onBeforeUpload(event: any, id: string, extension: string) {
    event.xhr.setRequestHeader('Authorization', this.authenticationService.token);
    event.xhr.setRequestHeader('uploadfilename', id + '.' + extension);
  }
}
