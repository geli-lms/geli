import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CourseRoutingModule} from './course-routing.module';
import {CourseComponent} from './course.component';
import {CourseNewComponent} from './course-new/course-new.component';
import {LectureModule} from '../lecture/lecture.module';
import {SharedModule} from '../shared/shared.module';
import {CourseContainerComponent} from './course-container/course-container.component';
import {UserModule} from '../user/user.module';
import {DuplicationService, ExportService, ImportService} from '../shared/services/data.service';
import {DialogService} from '../shared/services/dialog.service';
import {SaveFileService} from '../shared/services/save-file.service';
import {ReportModule} from '../report/report.module';
import {CourseDetailModule} from './course-detail/course-detail.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CourseRoutingModule,
    LectureModule,
    SharedModule,
    UserModule,
    ReportModule,
    CourseDetailModule,
  ],
  declarations: [
    CourseComponent,
    CourseNewComponent,
    CourseContainerComponent,
  ],
  providers: [
    ImportService,
    ExportService,
    DuplicationService,
    SaveFileService,
    DialogService
  ],
  exports: [
    CourseComponent,
    CourseContainerComponent,
  ]
})
export class CourseModule {
}
