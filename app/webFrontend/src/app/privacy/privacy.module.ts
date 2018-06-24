import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import {LegalnoticeComponent} from './legalnotice/legalnotice.component';
import {PrivacyComponent} from './privacynotice/privacy.component';
import {CookieBannerComponent} from './cookie-banner/cookie-banner.component';
import {TitleService} from '../shared/services/title.service';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule
  ],
  declarations: [
    LegalnoticeComponent,
    PrivacyComponent,
    CookieBannerComponent
  ],
  exports: [
    CookieBannerComponent
  ]
})
export class PrivacyModule { }
