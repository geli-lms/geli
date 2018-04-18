import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FileUploader} from 'ng2-file-upload';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {
  ENROLL_TYPES,
  ENROLL_TYPE_WHITELIST,
  ENROLL_TYPE_ACCESSKEY,
  ENROLL_TYPE_FREE,
  ICourse
} from '../../../../../../../shared/models/ICourse';
import {ActivatedRoute, Router} from '@angular/router';
import {CourseService, DuplicationService, ExportService, NotificationService} from '../../../shared/services/data.service';
import {MatSnackBar} from '@angular/material';
import {ShowProgressService} from '../../../shared/services/show-progress.service';
import {TitleService} from '../../../shared/services/title.service';
import {SaveFileService} from '../../../shared/services/save-file.service';
import {UserService} from '../../../shared/services/user.service';
import {DataSharingService} from '../../../shared/services/data-sharing.service';
import {DialogService} from '../../../shared/services/dialog.service';

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
  uploader: FileUploader = null;
  enrollTypes = ENROLL_TYPES;
  enrollTypeConstants = {
    ENROLL_TYPE_WHITELIST,
    ENROLL_TYPE_FREE,
    ENROLL_TYPE_ACCESSKEY,
  };

  message = 'Course successfully added.';

  constructor(private route: ActivatedRoute,
              private router: Router,
              private formBuilder: FormBuilder,
              private courseService: CourseService,
              private snackBar: MatSnackBar,
              private ref: ChangeDetectorRef,
              private showProgress: ShowProgressService,
              private titleService: TitleService,
              private exportService: ExportService,
              private saveFileService: SaveFileService,
              private duplicationService: DuplicationService,
              private userService: UserService,
              private dataSharingService: DataSharingService,
              private dialogService: DialogService,
              private notificationService: NotificationService) {

    this.route.params.subscribe(params => {
      this.id = params['id'];

      this.courseService.readSingleItem(this.id).then(
        (val: any) => {
          this.course = val.name;
          this.description = val.description;
          this.accessKey = val.accessKey;
          this.active = val.active;
          this.enrollType = val.enrollType;
          if (this.enrollType === 'whitelist') {
            this.mode = true;
          }
          this.courseOb = val;
          this.dataSharingService.setDataForKey('course', this.courseOb);
          this.titleService.setTitleCut(['Edit Course: ', this.course]);
        }, (error) => {
          this.snackBar.open('Couldn\'t load Course-Item', '', {duration: 3000});
        });
    });
  }

  ngOnInit() {
    this.generateForm();
    this.uploader = new FileUploader({
      url: '/api/courses/' + this.id + '/whitelist',
      headers: [{
        name: 'Authorization',
        value: localStorage.getItem('token'),
      }]
    });
    this.uploader.onProgressItem = () => {
      this.ref.detectChanges();
    };
    this.uploader.onCompleteItem = (item: any, response: any, status: any) => {
      if (status === 200) {
        const result = JSON.parse(response);
        this.snackBar.open('Upload complete, there now are ' + result.newlength + ' whitelisted users!', '', {duration: 10000});
        setTimeout(() => {
          this.uploader.clearQueue();
        }, 3000);
      } else {
        const error = JSON.parse(response);
        this.snackBar.open('Upload failed with status ' + status + ' message was: ' + error.message, '', {duration: 20000});
        setTimeout(() => {
          this.uploader.clearQueue();
        }, 6000);
      }
    };
  }

  generateForm() {
    this.newCourse = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      teacher: '',
    });
  }

  async createCourse() {
    this.showProgress.toggleLoadingGlobal(true);

    const request: any = {
      'name': this.course, 'description': this.description, '_id': this.id, 'active': this.active, 'enrollType': this.enrollType
    };

    if (this.enrollType === ENROLL_TYPE_FREE) {
      request.accessKey = null;
    } else if (this.accessKey !== '****') {
      request.accessKey = this.accessKey;
    }

    try {
      const course = await this.courseService.updateItem(request);

      this.notificationService.createItem({
        changedCourse: course,
        changedLecture: null,
        changedUnit: null,
        text: 'Course ' + course.name + ' has been updated.'
      });

      this.showProgress.toggleLoadingGlobal(false);
      this.snackBar.open('Saved successfully', '', {duration: 5000});
    } catch (err) {
      this.showProgress.toggleLoadingGlobal(false);
      this.snackBar.open('Saving course failed ' + err.error.message, 'Dismiss');
    }
  }

  async onExport() {
    try {
      const courseJSON = await this.exportService.exportCourse(this.courseOb);
      this.saveFileService.save(this.courseOb.name, JSON.stringify(courseJSON, null, 2));
    } catch (err) {
      this.snackBar.open('Export course failed ' + err.error.message, 'Dismiss');
    }
  }

  async onDuplicate() {
    try {
      const course = await this.duplicationService.duplicateCourse(this.courseOb, this.userService.user);
      this.router.navigate(['course', course._id, 'edit']);
      this.snackBar.open('Course successfully duplicated', '', {duration: 3000});
    } catch (err) {
      this.snackBar.open('Duplication of the course failed ' + err.error.message, 'Dismiss');
    }
  }

  onChangeActive(value) {
    this.active = value.checked;
  }

  cancel() {
    this.router.navigate(['/']);
  }

  deleteCourse() {
    this.dialogService.confirmDelete('course', this.courseOb.name)
      .subscribe(async res => {
        if (!res) {
          return;
        }
        await this.courseService.deleteItem(this.courseOb);
        await this.router.navigate(['/']);
        this.notificationService.createItem({
          changedCourse: this.courseOb,
          changedLecture: null,
          changedUnit: null,
          text: 'Course ' + this.courseOb.name + ' has been deleted.'
        });
      });
  }
}
