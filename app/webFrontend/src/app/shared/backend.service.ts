import {Injectable} from "@angular/core";
import {Http, Headers, Response} from '@angular/http';

import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';

@Injectable()
export class BackendService {

    baseURL: string = '/';
    apiURL: string = this.baseURL + "api/";
    token: string = '';

    constructor(private http: Http) {
        this.token = localStorage.getItem('currentUserToken');
    }

    authHeader(): Headers {
        let headers = new Headers({'Content-Type': 'application/json'});
        if (this.token !== '') {
            headers.set('Authorization', this.token)
        }
        return headers
    }

    get(serviceUrl: string): Observable<Response> {
        return this.http.get(this.apiURL + serviceUrl, {headers: this.authHeader()})
            .map(response => response.json());
    }

    post(serviceUrl: string, options: any): Observable<Response> {
        return this.http.post(this.apiURL + serviceUrl, options, {headers: this.authHeader()})
            .map(response => response.json());
    }

    put(serviceUrl: string, options: any): Observable<Response> {

        return this.http.put(this.apiURL + serviceUrl, options, {headers: this.authHeader()})
            .map(response => response.json());

    }

    delete(serviceUrl: string): Observable<Response> {

        return this.http.delete(this.apiURL + serviceUrl, {headers: this.authHeader()})
            .map(response => response.json());

    }

    onBeforeUpload(event: any, id: string, extension: string) {
        event.xhr.setRequestHeader('Authorization', this.token);
        event.xhr.setRequestHeader('uploadfilename', id + '.' + extension);
    }

}
