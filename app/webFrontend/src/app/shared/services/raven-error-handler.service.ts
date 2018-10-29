import * as Raven from 'raven-js';
import {ErrorHandler} from '@angular/core';
import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class RavenErrorHandler implements ErrorHandler {

  // We need to do a delayed setup of Sentry to avoid building different images for each environment
  setup(dsn: string) {
    if (!Raven.isSetup() && dsn) {
      Raven
        .config(dsn, {
          environment: 'web-frontend',
          release: '$TRAVIS_COMMIT',
        })
        .install();
    }
  }

  handleError(error: any): void {
    if (Raven.isSetup()) {
      Raven.captureException(error);
    }

    console.error(error);
  }
}
