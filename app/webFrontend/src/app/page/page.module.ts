import {APP_INITIALIZER, Injector, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageComponent } from './page.component';
import {PageService} from '../shared/services/data/page.service';
import {PageRouteService} from './page-route.service';

export function loadPageRoutes(pageRouteService: PageRouteService) {
  return () => pageRouteService.loadPageRoutes();
}

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [PageComponent],
  entryComponents: [
    PageComponent
  ],
  exports: [
    PageComponent
  ],
  providers: [
    PageRouteService,
    {
      provide: APP_INITIALIZER,
      useFactory: loadPageRoutes,
      deps: [PageRouteService],
      multi: true
    }
  ]
})
export class PageModule { }
