import {Injectable} from '@angular/core';

@Injectable()
export class DataSharingService {

  private data: any = {};

  constructor() {
  }

  getDataForKey(key: string) {
    return this.data[key];
  }

  setDataForKey(key: string, data: any) {
    this.data[key] = data;
  }

  deleteDataForKey(key: string) {
    delete this.data[key];
  }
}
