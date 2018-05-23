import {Injectable} from '@angular/core';
import {DataService} from './data.service';
import {BackendService} from './backend.service';

@Injectable()
export class MessageService extends DataService {
  static readonly API = 'message';

  constructor(public backendService: BackendService) {
    super('message', backendService);
  }

  async getMessages(queryParam: any): Promise<any> {
    const originalApiPath = this.apiPath;
    this.apiPath += '?';
    this.addQueryParam(queryParam);
    const res = await this.readItems();
    this.apiPath = originalApiPath;

    return res;
  }

  async getMessageCount(queryParam: any): Promise<any> {
    const originalApiPath = this.apiPath;
    this.apiPath += '/count?';
    this.addQueryParam(queryParam);

    const res = await this.readItems();
    this.apiPath = originalApiPath;

    return res;
  }

  private addQueryParam(queryObj: any){
    for (const key in queryObj) {
      this.apiPath += key + '=' + queryObj[key] + '&';
    }
  }

}
