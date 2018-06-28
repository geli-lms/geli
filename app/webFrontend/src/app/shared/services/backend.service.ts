import {Observable} from 'rxjs/Observable';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthenticationService} from './authentication.service';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs/index';
import 'rxjs/add/observable/empty';

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

    return throwError(err);
  }

  head(serviceUrl: string): Observable<any> {
    return this.http.head(BackendService.API_URL + serviceUrl, {headers: this.authenticationService.authHeader(),
      observe: 'response', responseType: 'blob'})
      .pipe(catchError(this.handleUnauthorized));
  }

  async getMimeType(serviceUrl: string): Promise<string> {
    const response = await this.head(serviceUrl).toPromise();
    return response.body.type;
  }

  get(serviceUrl: string): Observable<any> {
    return this.http.get(BackendService.API_URL + serviceUrl, {headers: this.authenticationService.authHeader()})
      .pipe(catchError(this.handleUnauthorized));
  }

  getDownload(serviceUrl: string): Observable<any> {
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
