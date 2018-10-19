import {Injectable, Injector} from '@angular/core';
import {InitApiService} from './init-api.service';
import {IPage} from '../../../../../../../shared/models/IPage';
import {Router} from '@angular/router';
import {PageComponent} from '../../../page/page.component';
import {HttpClient} from '@angular/common/http';
import {BackendService} from '../backend.service';

@Injectable({
  providedIn: 'root'
})
export class InitService {

  private pageData: any;
  private initPromise: Promise<any>;
  private initPromiseDone = false;
  private apiUrl: string;

  constructor(
    private http: HttpClient
  ) {
    this.apiUrl = BackendService.API_URL;
  }

  loadInitData(): Promise<any> {
    if (this.initPromiseDone) {
      return Promise.resolve();
    }

    if (this.initPromise != null) {
      return this.initPromise;
    }

    const url = this.apiUrl + 'pages';
    this.initPromise = this.http
      .get(url)
      .toPromise()
      .then((pageData) => {
        this.pageData = pageData;
        this.initPromiseDone = true;
      })
      .catch((error) => {
        this.initPromiseDone = true;
        return Promise.resolve();
      });

    return this.initPromise;
  }

  get pageRouteData(): any {
    return this.pageData;
  }
}
