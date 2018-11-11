import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserAdminComponent} from './user-admin/user-admin.component';
import {AdminComponent} from './admin.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../shared/shared.module';
import {AceEditorModule} from 'ng2-ace-editor';
import {AdminRoutingModule} from './admin-routing.module';
import {AdminMiscComponent} from './admin-misc/admin-misc.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AceEditorModule,
    AdminRoutingModule,
  ],
  declarations: [
    AdminComponent,
    UserAdminComponent,
    AdminMiscComponent,
  ]
})
export class AdminModule {
}
