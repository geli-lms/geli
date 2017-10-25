import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CourseRoutingModule} from './course-routing.module';
import {CourseComponent} from './course.component';
import {CourseDetailComponent} from './course-detail/course-detail.component';
import {CourseNewComponent} from './course-new/course-new.component';
import {LectureModule} from '../lecture/lecture.module';
import {TeacherReportComponent} from './teacher-report/teacher-report.component';
import {MaterialModule} from '@angular/material';
import {SharedModule} from '../shared/shared.module';
import {CourseContainerComponent} from './course-container/course-container.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CourseRoutingModule,
    LectureModule,
    SharedModule
  ],
  declarations: [
    CourseComponent,
    CourseDetailComponent,
    CourseNewComponent,
    TeacherReportComponent,
    CourseContainerComponent,
  ],
  providers: [],
  exports: [
    CourseComponent,
    CourseContainerComponent
  ]
})
export class CourseModule {
}
