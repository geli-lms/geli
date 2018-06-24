import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import {LegalnoticeComponent} from './legalnotice/legalnotice.component';
import {PrivacyComponent} from './privacynotice/privacy.component';
import {CookieBannerComponent} from './cookie-banner/cookie-banner.component';
import {TitleService} from '../shared/services/title.service';
import {MaterialImportModule} from '../shared/modules/material-import.module';
import {MatButtonModule} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    MatButtonModule
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
