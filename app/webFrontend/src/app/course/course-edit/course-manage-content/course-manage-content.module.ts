import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CourseManageContentRoutingModule} from './course-manage-content-routing.module';
import {CourseManageContentComponent} from './course-manage-content.component';
import {LectureEditComponent} from './lecture-edit/lecture-edit.component';
import {DragulaModule} from 'ng2-dragula';
import {SharedModule} from '../../../shared/shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {LectureModule} from '../../../lecture/lecture.module';
import {UnitFormModule} from '../../../unit/unit-form/unit-form.module';

@NgModule({
  imports: [
    CommonModule,
    CourseManageContentRoutingModule,
    DragulaModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    LectureModule,
    UnitFormModule,
  ],
  declarations: [
    CourseManageContentComponent,
    LectureEditComponent,
  ],
  exports: [
    CourseManageContentComponent,
    LectureEditComponent,
  ]
})
export class CourseManageContentModule { }
