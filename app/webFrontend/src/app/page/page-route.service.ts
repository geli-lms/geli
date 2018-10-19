import {Injectable, Injector} from '@angular/core';
import {InitApiService} from '../shared/services/init/init-api.service';
import {IPage} from '../../../../../shared/models/IPage';
import {Router} from '@angular/router';
import {PageComponent} from './page.component';

@Injectable({
  providedIn: 'root'
})
export class PageRouteService {

  pages: any;

  constructor(
    private injector: Injector,
    private initApiService: InitApiService
  ) { }

  async loadPageRoutes() {
    /*
    const router = this.injector.get(Router);
    let newRouterConfig = [];
    await this.initApiService.getInitData('/pages')
      .subscribe((data: IPage[]) => {
        this.pages = data;
        const routerConfig = router.config;
        for (const page of this.pages) {
          routerConfig.unshift({
            path: page.path,
            component: PageComponent
          });
        }

        newRouterConfig = routerConfig;
      });

    const debug = 0;
    await router.resetConfig(newRouterConfig);
    */
  }
}
