import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CourseDetailComponent} from './course-detail.component';
import {CourseOverviewComponent} from './course-overview/course-overview.component';
import {FileViewComponent} from './file-view/file-view.component';
import {DownloadCourseDialogComponent} from './download-course-dialog/download-course-dialog.component';
import {UploadUnitCheckboxComponent} from './download-course-dialog/downloadCheckBoxes/upload-unit-checkbox.component';
import {LectureCheckboxComponent} from './download-course-dialog/downloadCheckBoxes/lecture-checkbox.component';
import {UnitCheckboxComponent} from './download-course-dialog/downloadCheckBoxes/unit-checkbox.component';
import {CourseDetailRoutingModule} from './course-detail-routing.module';
import {SharedModule} from '../../shared/shared.module';
import {LectureModule} from '../../lecture/lecture.module';
import {FormsModule} from '@angular/forms';
import {CourseDetailDataResolve} from '../../shared/services/course-detail-data-resolve.service';
import {VideoViewComponent} from './video-view/video-view.component';
import {GridComponent} from './video-view/grid/grid.component';
import {MessagingModule} from '../../messaging/messaging.module';
import {PickerModule} from '@ctrl/ngx-emoji-mart';
import {CourseForumComponent} from './course-forum/course-forum.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    CourseDetailRoutingModule,
    LectureModule,
    FormsModule,
    MessagingModule,
    PickerModule
  ],
  declarations: [
    CourseDetailComponent,
    CourseOverviewComponent,
    FileViewComponent,
    DownloadCourseDialogComponent,
    LectureCheckboxComponent,
    UnitCheckboxComponent,
    UploadUnitCheckboxComponent,
    VideoViewComponent,
    GridComponent,
    CourseForumComponent,
  ],
  entryComponents: [
    DownloadCourseDialogComponent,
  ],
  exports: [
    CourseDetailComponent,
    DownloadCourseDialogComponent,
    LectureCheckboxComponent,
    UnitCheckboxComponent,
  ],
  providers: [
    CourseDetailDataResolve,
  ]
})
export class CourseDetailModule {
}
