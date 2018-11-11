import {Injectable} from '@angular/core';
import {DataService} from './data.service';
import {BackendService} from './backend.service';
import {IMessage} from '../../../../../../shared/models/messaging/IMessage';


@Injectable()
export class MessageService extends DataService {
  static readonly API = 'message';

  constructor(public backendService: BackendService) {
    super('message', backendService);
  }

  async getMessages(queryParam: any): Promise<IMessage[]> {
    const api = this.apiPath + '?' + this.getQueryParamsString(queryParam);
    return this.backendService
      .get(api)
      .toPromise();
  }

  async getMessageCount(queryParam: any): Promise<any> {
    const api = this.apiPath + '/count?' + this.getQueryParamsString(queryParam) ;
    return this.backendService
      .get(api)
      .toPromise();
  }

  private getQueryParamsString(queryObj: any) {
    let result = '';
    for (const key in queryObj) {
      if (queryObj.hasOwnProperty(key)) {
        result += key + '=' + queryObj[key] + '&';
      }
    }
    return result;
  }

}
