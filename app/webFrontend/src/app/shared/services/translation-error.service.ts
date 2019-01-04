import {Injectable} from '@angular/core';
import {RavenErrorHandler} from './raven-error-handler.service';
import {MissingTranslationHandler, MissingTranslationHandlerParams} from '@ngx-translate/core';

@Injectable()
export class TranslationErrorService implements MissingTranslationHandler {

  constructor(private errorHandler: RavenErrorHandler) {
  }

  handle(params: MissingTranslationHandlerParams) {
    this.errorHandler.handleError(`Missing Translation: ${params.key}`);
  }
}
