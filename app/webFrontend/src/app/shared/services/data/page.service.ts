import { Injectable } from '@angular/core';
import {DataService} from '../data.service';
import {BackendService} from '../backend.service';

@Injectable()
export class PageService extends DataService {

  constructor(public backendService: BackendService) {
    super('pages/', backendService);
  }

  getPageContent(path: string) {
    const originalApiPath = this.apiPath;
    this.apiPath += 'detail/';
    const promise = this.readSingleItem(path);
    this.apiPath = originalApiPath;
    return promise;
  }
}
