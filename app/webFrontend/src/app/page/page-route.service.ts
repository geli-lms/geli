import {Injectable, Injector} from '@angular/core';
import {PageService} from '../shared/services/data/page.service';
import {Router} from '@angular/router';
import {PageComponent} from './page.component';
import {IPage} from '../../../../../shared/models/IPage';

@Injectable({
  providedIn: 'root'
})
export class PageRouteService {

  constructor(
    private injector: Injector,
    private pageService: PageService
  ) { }

  async loadPageRoutes(): Promise<any> {
    const router = this.injector.get(Router);
    const pages: IPage[] = <IPage[]>await this.pageService.readItems();

    for (const page of pages) {
      router.config.unshift({
        path: page.path,
        component: PageComponent
      });
    }
  }
}
