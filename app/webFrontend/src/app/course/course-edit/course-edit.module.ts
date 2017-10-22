import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MembersComponent} from './members/members.component';
import {CourseUserListComponent} from './course-user-list/course-user-list.component';
import {CourseManageContentComponent} from './course-manage-content/course-manage-content.component';
import {CourseEditComponent} from './course-edit.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '@angular/material';
import {FileUploadModule} from 'ng2-file-upload';
import {TeachersComponent} from './teachers/teachers.component';
import {DragulaModule} from 'ng2-dragula';
import {MdFabMenuComponent} from '../../shared/components/md-fab-menu/md-fab-menu.component';
import {SharedModule} from '../../shared/shared.module';
import {CourseEditRoutingModule} from './course-edit-routing.module';
import {LectureModule} from '../../lecture/lecture.module';
import {UnitFormModule} from '../../unit/unit-form/unit-form.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    DragulaModule,
    FileUploadModule,
    SharedModule,
    CourseEditRoutingModule,
    LectureModule,
    UnitFormModule
  ],
  declarations: [
    CourseEditComponent,
    CourseManageContentComponent,
    CourseUserListComponent,
    MembersComponent,
    TeachersComponent,
    MdFabMenuComponent,
  ],
  exports: [
    CourseEditComponent,
    CourseManageContentComponent,
    CourseUserListComponent,
    MembersComponent,
    TeachersComponent,
    MdFabMenuComponent,
  ]
})
export class CourseEditModule { }
