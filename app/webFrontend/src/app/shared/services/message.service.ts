import { Injectable } from '@angular/core';
import {DataService} from './data.service';
import {BackendService} from './backend.service';

@Injectable()
export class MessageService extends  DataService{
  static readonly API = 'message';

  constructor(public backendService: BackendService) {
    super( 'message', backendService);
  }

  async getMessages(queryParam: any): Promise<any> {
    const originalApiPath = this.apiPath;
    this.apiPath += '?';
    for (const key in queryParam){
      this.apiPath += key + '=' +queryParam[key] + '&';
    }
    const res =  await this.readItems();
    this.apiPath = originalApiPath;

    return res;
  }

}
