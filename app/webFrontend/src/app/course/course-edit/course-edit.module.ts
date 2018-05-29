import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MembersComponent} from './members/members.component';
import {CourseUserListComponent} from './course-user-list/course-user-list.component';
import {CourseEditComponent} from './course-edit.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FileUploadModule} from 'ng2-file-upload';
import {TeachersComponent} from './teachers/teachers.component';
import {DragulaModule} from 'ng2-dragula';
import {SharedModule} from '../../shared/shared.module';
import {CourseEditRoutingModule} from './course-edit-routing.module';
import {WhitelistEditComponent} from './members/whitelist-edit/whitelist-edit.component';
import {CourseUserListOverviewComponent} from './course-user-list/course-user-list-overview/course-user-list-overview.component';
import {CourseUserListShowComponent} from './course-user-list/course-user-list-show/course-user-list-show.component';
import {WhitelistShowComponent} from './members/whitelist-show/whitelist-show.component';
import {GeneralTabComponent} from './general-tab/general-tab.component';
import {CourseMediaComponent} from './course-media/course-media.component';
import {MatFabMenuComponent} from '../../shared/components/mat-fab-menu/mat-fab-menu.component';
import {MAT_DIALOG_DATA} from '@angular/material';

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
    CourseMediaComponent,
    WhitelistEditComponent,
    CourseUserListOverviewComponent,
    CourseUserListShowComponent,
    WhitelistShowComponent,
    GeneralTabComponent
  ],
  exports: [
    CourseEditComponent,
    CourseUserListComponent,
    MembersComponent,
    TeachersComponent,
    MatFabMenuComponent,
    GeneralTabComponent,
  ],
  providers: [
    { provide: MAT_DIALOG_DATA, useValue: {} },
  ]
})
export class CourseEditModule {
}
