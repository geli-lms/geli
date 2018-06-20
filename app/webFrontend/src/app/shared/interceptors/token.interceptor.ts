import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import {AuthenticationService} from '../services/authentication.service';
import {Observable} from 'rxjs/Observable';

// FIXME: I fear this doesn't help w.r.t. issue #729, so it presumably should be removed again before the corresponding branch gets a PR!
@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(public authenticationService: AuthenticationService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.authenticationService.token) {
      request = request.clone({
        setHeaders: {
          Authorization: this.authenticationService.token
        }
      });
    }
    return next.handle(request);
  }
}
