import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CourseRoutingModule} from './course-routing.module';
import {CourseComponent} from './course.component';
import {CourseDetailComponent} from './course-detail/course-detail.component';
import {CourseNewComponent} from './course-new/course-new.component';
import {LectureModule} from '../lecture/lecture.module';
import {SharedModule} from '../shared/shared.module';
import {CourseContainerComponent} from './course-container/course-container.component';
import {UserModule} from '../user/user.module';
import {DownloadCourseDialogComponent} from './course-detail/download-course-dialog/download-course-dialog.component';
import {LectureCheckboxComponent} from './course-detail/download-course-dialog/downloadCheckBoxes/lecture-checkbox.component';
import {UnitCheckboxComponent} from './course-detail/download-course-dialog/downloadCheckBoxes/unit-checkbox.component';
import {UploadUnitCheckboxComponent} from './course-detail/download-course-dialog/downloadCheckBoxes/upload-unit-checkbox.component';
import {DuplicationService, ExportService, ImportService} from '../shared/services/data.service';
import {SaveFileService} from '../shared/services/save-file.service';
import {ReportModule} from '../report/report.module';
import {RouterOutlet} from '@angular/router';

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
  ],
  declarations: [
    CourseComponent,
    CourseDetailComponent,
    CourseNewComponent,
    CourseContainerComponent,
    DownloadCourseDialogComponent,
    LectureCheckboxComponent,
    UnitCheckboxComponent,
    UploadUnitCheckboxComponent
  ],
  entryComponents: [
    DownloadCourseDialogComponent,
  ],
  providers: [
    ImportService,
    ExportService,
    DuplicationService,
    SaveFileService,
  ],
  exports: [
    CourseComponent,
    CourseContainerComponent,
    DownloadCourseDialogComponent,
    LectureCheckboxComponent,
    UnitCheckboxComponent
  ]
})
export class CourseModule {
}
