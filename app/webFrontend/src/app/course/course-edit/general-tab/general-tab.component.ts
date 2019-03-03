import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {
  ENROLL_TYPES,
  ENROLL_TYPE_WHITELIST,
  ENROLL_TYPE_ACCESSKEY,
  ENROLL_TYPE_FREE,
  ICourse,
  FREETEXT_STYLES
} from '../../../../../../../shared/models/ICourse';

import {ActivatedRoute, Router} from '@angular/router';
import {CourseService, DuplicationService, ExportService, NotificationService} from '../../../shared/services/data.service';
import {SnackBarService} from '../../../shared/services/snack-bar.service';
import {ShowProgressService} from '../../../shared/services/show-progress.service';
import {TitleService} from '../../../shared/services/title.service';
import {SaveFileService} from '../../../shared/services/save-file.service';
import {UserService} from '../../../shared/services/user.service';
import {DataSharingService} from '../../../shared/services/data-sharing.service';
import {DialogService} from '../../../shared/services/dialog.service';
import {WhitelistService} from '../../../shared/services/whitelist.service';
import {TranslateService} from '@ngx-translate/core';
import ResponsiveImage from '../../../models/ResponsiveImage';
import {IResponsiveImageData} from '../../../../../../../shared/models/IResponsiveImageData';
import {BreakpointSize} from '../../../shared/enums/BreakpointSize';

@Component({
  selector: 'app-course-edit-general-tab',
  templateUrl: './general-tab.component.html',
  styleUrls: ['./general-tab.component.scss']
})
export class GeneralTabComponent implements OnInit {
  course: string;
  description: string;
  accessKey: string;
  active = false;
  mode = false;
  enrollType: string;
  newCourse: FormGroup;
  id: string;
  courseOb: ICourse;
  enrollTypes = ENROLL_TYPES;
  enrollTypeConstants = {
    ENROLL_TYPE_WHITELIST,
    ENROLL_TYPE_FREE,
    ENROLL_TYPE_ACCESSKEY,
  };
  freeTextStyles = FREETEXT_STYLES;
  freeTextStyle: string;


  courseImageData: IResponsiveImageData;

  whitelistFile: File;
  whitelistUsers: any[];

  message = 'Course successfully added.';

  constructor(private route: ActivatedRoute,
              private router: Router,
              private formBuilder: FormBuilder,
              private courseService: CourseService,
              private snackBar: SnackBarService,
              private ref: ChangeDetectorRef,
              private showProgress: ShowProgressService,
              private titleService: TitleService,
              private exportService: ExportService,
              private saveFileService: SaveFileService,
              private duplicationService: DuplicationService,
              private userService: UserService,
              private dataSharingService: DataSharingService,
              private dialogService: DialogService,
              private whitelistService: WhitelistService,
              private notificationService: NotificationService,
              private translate: TranslateService) {

    this.route.params.subscribe(params => {
      this.id = params['id'];

      this.courseService.readCourseToEdit(this.id).then(course => {
        this.courseOb = course;

        this.courseImageData = course.image ? {
            breakpoints: course.image.breakpoints,
            pathToImage: ''
        } : null;


        this.course = this.courseOb.name;
        this.description = this.courseOb.description;
        this.accessKey = this.courseOb.accessKey;
        this.active = this.courseOb.active;
        this.enrollType = this.courseOb.enrollType;
        this.mode = (this.enrollType === 'whitelist');
        this.freeTextStyle = this.courseOb.freeTextStyle;

        this.dataSharingService.setDataForKey('course', this.courseOb);
        this.titleService.setTitleCut(['Edit Course: ', this.course]);
      }).catch(err => {
        this.snackBar.open('Couldn\'t load Course-Item');
      });
    });
  }

  ngOnInit() {
    this.generateForm();
  }

  openWhitelistDialog() {
    this.dialogService.whitelist(this.courseOb);
  }

  generateForm() {
    this.newCourse = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      teacher: '',
    });
  }

  /**
   * Opens the {@link FilepickerDialog} which will handle the choosing / uploading of the image file.
   *
   * @returns {Promise<void>}
   */
  async openImageChooserDialog() {
    const apiPath = 'api/courses/picture/' + this.id;

    const responsiveImage =
      ResponsiveImage.create()
        .breakpoint(BreakpointSize.MOBILE, { width: 284, height: 190 });

    const result = await this.dialogService
      .uploadResponsiveImage('Choose a picture for the course.', apiPath, responsiveImage).toPromise();

    if (result && result.success) {
      this.courseImageData = result.result;
    } else if (result && !result.success
      && result.result) {

      if (result.result.name === 'BadRequestError') {
        this.snackBar.openLong('Image upload failed. It seems like the file type is not correct.');
      } else if (result.result.name === 'ForbiddenError') {
        this.snackBar.openLong('Image upload failed. It seems like you have no rights to edit the picture.');
      } else {
        this.snackBar.openLong('Image upload failed.');
      }
    }
  }

  async removeCoursePicture() {
    const result = await this.courseService.removePicture(this.id);

    this.courseImageData = null;
  }

  async createCourse() {
    this.showProgress.toggleLoadingGlobal(true);

    const request: any = {
      'name': this.course,
      'description': this.description,
      '_id': this.id,
      'active': this.active,
      'enrollType': this.enrollType,
      'freeTextStyle': this.freeTextStyle || ''
    };

    // update local courseObj
    this.courseOb = {...this.courseOb, ...request};

    if (this.enrollType === ENROLL_TYPE_FREE) {
      request.accessKey = null;
    } else if (this.accessKey !== '****') {
      request.accessKey = this.accessKey;
    }

    try {
      const course = await this.courseService.updateItem(request);

      this.notificationService.createItem({
        targetId: course._id,
        targetType: 'course',
        text: 'Course ' + course.name + ' has been updated.'
      });

      // propagate changes
      this.dataSharingService.setDataForKey('course', this.courseOb);

      this.showProgress.toggleLoadingGlobal(false);
      this.snackBar.open('Saved successfully');
    } catch (err) {
      this.showProgress.toggleLoadingGlobal(false);
      this.snackBar.open('Saving course failed ' + err.error.message, );
    }
  }

  async onExport() {
    try {
      const courseJSON = await this.exportService.exportCourse(this.courseOb);
      this.saveFileService.save(this.courseOb.name, JSON.stringify(courseJSON, null, 2));
    } catch (err) {
      this.snackBar.open('Export course failed ' + err.error.message);
    }
  }

  async onDuplicate() {
    try {
      const course = await this.duplicationService.duplicateCourse(this.courseOb, this.userService.user);
      this.router.navigate(['course', course._id, 'edit']);
      this.snackBar.open('Course successfully duplicated');
    } catch (err) {
      this.snackBar.open('Duplication of the course failed ' + err.error.message);
    }
  }

  onChangeActive(value) {
    this.active = value.checked;
  }

  cancel() {
    this.router.navigate(['/']);
  }

  deleteCourse() {
    this.dialogService.confirmDelete('course', this.courseOb.name).subscribe(async res => {
      if (res === false) {
        return;
      }

      this.translate.get(['common.course', 'course.hasBeenDeleted']).subscribe(async (t: string) => {
        await this.notificationService.createItem({
          targetId: this.courseOb._id,
          targetType: 'course',
          text: t['common.course'] + ' ' + this.courseOb.name + ' ' + t['course.hasBeenDeleted']
        });
        this.snackBar.open(t['common.course'] + ' ' + this.courseOb.name + ' ' + t['course.hasBeenDeleted']);
      });

      await this.courseService.deleteItem(this.courseOb);
      await this.router.navigate(['/']);
    });
  }
}
