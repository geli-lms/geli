import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BackendService} from '../backend.service';

@Injectable({
  providedIn: 'root'
})
export class InitApiService {

  private apiUrl;

  constructor(private http: HttpClient) {
    this.apiUrl = BackendService.API_URL;
  }

  public getInitData(initRoute: string): Promise<any> {
    return this.http.get(this.apiUrl + initRoute).toPromise();
  }
}
