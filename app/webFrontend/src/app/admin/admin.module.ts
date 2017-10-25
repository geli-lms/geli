import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserAdminComponent} from './user-admin/user-admin.component';
import {AdminComponent} from './admin.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    AdminComponent,
    UserAdminComponent
  ]
})
export class AdminModule {
}
