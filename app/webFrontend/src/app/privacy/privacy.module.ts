import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {LegalnoticeComponent} from './legalnotice/legalnotice.component';
import {PrivacyComponent} from './privacynotice/privacy.component';
import {TitleService} from '../shared/services/title.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    LegalnoticeComponent,
    PrivacyComponent
  ]
})
export class PrivacyModule { }
