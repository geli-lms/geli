import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {LegalnoticeComponent} from './legalnotice/legalnotice.component';
import {PrivacyComponent} from './privacynotice/privacy.component';
import {CookieBannerComponent} from './cookie-banner/cookie-banner.component';
import {MatButtonModule} from '@angular/material';
import {RouterModule} from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    MatButtonModule,
    RouterModule
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
