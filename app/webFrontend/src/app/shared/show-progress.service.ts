import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Subject} from "rxjs";

@Injectable()
export class ShowProgressService {

    private toggleSidenavSource = new Subject<boolean>();
    toggleSidenav$ = this.toggleSidenavSource.asObservable();

    toggleLoadingGlobal(toggle: boolean) {
        this.toggleSidenavSource.next(toggle);
    }

}
