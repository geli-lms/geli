import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CourseRoutingModule} from './course-routing.module';
import {CourseComponent} from './course.component';
import {CourseDetailComponent} from './course-detail/course-detail.component';
import {CourseNewComponent} from './course-new/course-new.component';
import {LectureModule} from '../lecture/lecture.module';
import {TeacherReportComponent} from './teacher-report/teacher-report.component';
import {SharedModule} from '../shared/shared.module';
import {CourseContainerComponent} from './course-container/course-container.component';
import {UserModule} from '../user/user.module';
import {DuplicationService, ExportService, ImportService} from '../shared/services/data.service';
import {SaveFileService} from '../shared/services/save-file.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CourseRoutingModule,
    LectureModule,
    SharedModule,
    UserModule
  ],
  declarations: [
    CourseComponent,
    CourseDetailComponent,
    CourseNewComponent,
    TeacherReportComponent,
    CourseContainerComponent,
  ],
  providers: [
    ImportService,
    ExportService,
    DuplicationService,
    SaveFileService,
  ],
  exports: [
    CourseComponent,
    CourseContainerComponent
  ]
})
export class CourseModule {
}
