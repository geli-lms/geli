import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MembersComponent} from './members/members.component';
import {CourseUserListComponent} from './course-user-list/course-user-list.component';
import {CourseManageContentComponent} from './course-manage-content/course-manage-content.component';
import {CourseEditComponent} from './course-edit.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FileUploadModule} from 'ng2-file-upload';
import {TeachersComponent} from './teachers/teachers.component';
import {DragulaModule} from 'ng2-dragula';
import {MatFabMenuComponent} from '../../shared/components/mat-fab-menu/mat-fab-menu.component';
import {SharedModule} from '../../shared/shared.module';
import {CourseEditRoutingModule} from './course-edit-routing.module';
import {GeneralTabComponent} from './general-tab/general-tab.component';
import {CourseManageContentModule} from './course-manage-content/course-manage-content.module';
import { CourseMediamanagerComponent } from './course-mediamanager/course-mediamanager.component';
import { CourseMediamanagerDetailDialog } from './course-mediamanager/course-mediamanager-detail-dialog/course-mediamanager-detail.dialog';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DragulaModule,
    FileUploadModule,
    SharedModule,
    CourseEditRoutingModule,
  ],
  declarations: [
    CourseEditComponent,
    CourseUserListComponent,
    MembersComponent,
    TeachersComponent,
    GeneralTabComponent,
    CourseMediamanagerComponent,
    CourseMediamanagerDetailDialog,
  ],
  exports: [
    CourseEditComponent,
    CourseUserListComponent,
    MembersComponent,
    TeachersComponent,
    MatFabMenuComponent,
    GeneralTabComponent,
  ]
})
export class CourseEditModule {
}
