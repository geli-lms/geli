import * as Raven from 'raven-js';
import {ErrorHandler} from '@angular/core';

export class RavenErrorHandler implements ErrorHandler {

  // We need to do a delayed setup of Sentry to avoid building different images for each environment
  setup(dsn: string) {
    if (!Raven.isSetup() && dsn) {
      Raven
        .config(dsn)
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
