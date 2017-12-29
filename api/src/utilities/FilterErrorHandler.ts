import {Middleware, ExpressErrorMiddlewareInterface} from 'routing-controllers';

@Middleware({type: 'after'})
export class FilterErrorHandler implements ExpressErrorMiddlewareInterface {

  error(error: any, request: any, response: any, next: (err: any) => any) {
    if (error && error.httpCode && error.httpCode !== 500) {
      // We want all HttpErrors to not further propagate, so that they will not be logged or reported to Sentry
      next(null);
      return;
    }

    next(error);
  }
}
