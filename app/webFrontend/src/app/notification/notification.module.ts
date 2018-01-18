
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {
  NotificationService,
  NotificationSettingsService
} from '../shared/services/data.service';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../shared/shared.module';
import {NotificationComponent} from './notification.component';
import {RouterModule} from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule
  ],
  declarations: [
    NotificationComponent,
  ],
  providers: [
    NotificationSettingsService,
    NotificationService
  ],
  exports: [
    NotificationComponent
  ]
})
export class NotificationModule {
}
