import {Component, OnInit, OnDestroy} from '@angular/core';
import {ICourse} from '../../../../../../../shared/models/ICourse';
import {ILecture} from '../../../../../../../shared/models/ILecture';
import {ILectureCreate} from '../../../../../../../shared/models/ILectureCreate';
import {CourseService, LectureService, NotificationService} from '../../../shared/services/data.service';
import {ShowProgressService} from 'app/shared/services/show-progress.service';
import {DialogService} from '../../../shared/services/dialog.service';
import {UserService} from '../../../shared/services/user.service';
import {MatSnackBar} from '@angular/material';
import {DragulaService} from 'ng2-dragula';
import {ActivatedRoute, Router} from '@angular/router';
import {DataSharingService} from '../../../shared/services/data-sharing.service';
import {Subject} from 'rxjs/Subject';

@Component({
  selector: 'app-course-manage-content',
  templateUrl: './course-manage-content.component.html',
  styleUrls: ['./course-manage-content.component.scss']
})
export class CourseManageContentComponent implements OnInit, OnDestroy {
  course: ICourse;

  fabOpen = false;

  onCloseAllForms = new Subject();
  onReloadCourse = new Subject();

  constructor(private route: ActivatedRoute,
              private router: Router,
              private lectureService: LectureService,
              private courseService: CourseService,
              private showProgress: ShowProgressService,
              private snackBar: MatSnackBar,
              private dialogService: DialogService,
              private dragulaService: DragulaService,
              public userService: UserService,
              private dataSharingService: DataSharingService,
              private notificationService: NotificationService) {
    // setup subjects
    this.dataSharingService.setDataForKey('onCloseAllForms', this.onCloseAllForms);
    this.onCloseAllForms.asObservable().subscribe(() => this.closeAllForms());
    this.dataSharingService.setDataForKey('onReloadCourse', this.onReloadCourse);
    this.onReloadCourse.asObservable().subscribe(async (resolve: Function) => {
      await this.reloadCourse();
      return resolve();
    });
    // setup course object
    const course = this.dataSharingService.getDataForKey('course');
    if (course) {
      this.course = course;
      this.setOpenedLectureAndUnit();
      this.setAddLectureIfPresent();
      this.setAddUnitIfPresent();
    } else {
      this.getCourse();
    }
  }

  ngOnInit() {
    // Make items only draggable by dragging the handle
    this.dragulaService.createGroup('lectures', {
      moves: (el, container, handle) => {
        return handle.classList.contains('lecture-drag-handle');
      }
    });
    this.dragulaService.createGroup('units', {
      moves: (el, container, handle) => {
        return handle.classList.contains('unit-drag-handle');
      }
    });

    this.dragulaService.dropModel('lectures').subscribe(() => {
      this.updateLectureOrder();
    });
    this.dragulaService.dropModel('units').subscribe((value: any) => {
      this.updateUnitOrder();

      // When dragging to another lecture we need to update the other lecture too
      if (value.target.dataset.lectureId) {
        this.updateUnitOrder(value.target.dataset.lectureId);
      }
    });
  }

  ngOnDestroy() {
    this.dragulaService.destroy('lectures');
    this.dragulaService.destroy('units');
  }

  isInMode(lecture, create) {
    return this.dataSharingService.getDataForKey(`${lecture}-${create}-mode`) || false;
  }

  isLectureOpen() {
    return this.dataSharingService.getDataForKey('openLectureId') !== null;
  }

  getCourse() {
    this.route.parent.parent.params.subscribe(params => {
      const courseId = params['id'];

      this.courseService.readCourseToEdit(courseId).then(
        (course: ICourse) => {
          this.course = course;
          this.dataSharingService.setDataForKey('course', this.course);
          this.setOpenedLectureAndUnit();
          this.setAddLectureIfPresent();
          this.setAddUnitIfPresent();
        }, (error) => {
          this.snackBar.open('Couldn\'t load Course-Item', '', {duration: 3000});
        });
    });
  }

  setOpenedLectureAndUnit() {
    this.route.params.subscribe((params) => {
      const lectureId = params['lecture'];
      if (!lectureId) {
        this.dataSharingService.setDataForKey('openLectureId', null);
        return;
      }
      const lecture = this.course.lectures.find(lec => lec._id === lectureId);
      if (!lecture) {
        // invalid lecture, discard and navigate to root
        return this.route.url.subscribe(segments => {
          const path = segments.map(() => '../').join('') || '';
          this.router.navigate([path], {relativeTo: this.route});
        });
      }
      this.dataSharingService.setDataForKey('openLectureId', lecture._id);

      const unitId = params['unit'];
      if (!unitId) {
        this.dataSharingService.setDataForKey('unit-edit-mode', false);
        this.dataSharingService.setDataForKey('unit-edit-element', null);
        return;
      }
      const openUnit = lecture.units.find(unit => unit._id === unitId);
      if (!openUnit) {
        // invalid unit, discard and navigate to lecture
        return this.route.url.subscribe(segments => {
          let path = segments.map(() => '../').join('') || '';
          path += `lecture/${lectureId}`;
          this.router.navigate([path], {relativeTo: this.route});
        });
      }
      this.dataSharingService.setDataForKey('unit-edit-mode', true);
      this.dataSharingService.setDataForKey('unit-edit-element', openUnit);
    });
  }

  setAddLectureIfPresent() {
    this.route.url.subscribe(segments => {
      if (!segments.length) {
        this.dataSharingService.setDataForKey('lecture-create-mode', false);
        return;
      }
      if (segments.length === 2 && segments[0].path === 'lecture' && segments[1].path === 'add') {
        this.dataSharingService.setDataForKey('lecture-create-mode', true);
      }
    });
  }

  setAddUnitIfPresent() {
    this.route.url.subscribe(segments => {
      if (!segments.length) {
        this.dataSharingService.setDataForKey('unit-create-mode', false);
        this.dataSharingService.setDataForKey('unit-create-type', null);
        return;
      }
      const url = segments.map(segment => segment.path).join('/');
      if (url.indexOf('/unit/add/') !== -1) {
        const type = segments[segments.length - 1].path; // last segment is type
        this.dataSharingService.setDataForKey('unit-create-mode', true);
        this.dataSharingService.setDataForKey('unit-create-type', type);
      }
    });
  }

  updateLectureOrder() {
    this.courseService.updateItem({
      '_id': this.course._id,
      'lectures': this.course.lectures.map((lecture) => lecture._id)
    });
  }

  updateUnitOrder(id: string = null) {
    if (!id) {
      id = this.dataSharingService.getDataForKey('openLectureId');
    }
    const lecture = this.course.lectures.find(l => l._id === id);

    if (!lecture) {
      return;
    }
    this.lectureService.updateItem({
      '_id': lecture._id,
      'units': lecture.units.map((unit) => unit._id)
    });
  }

  async createLecture({name, description}: {name: string, description: string}) {
    const newLecture = await this.lectureService.createItem<ILectureCreate, ILecture>({
      courseId: this.course._id, name, description
    });
    this.dataSharingService.setDataForKey('lecture-create-mode', false);
    await this.notificationService.createItem({
      targetId: newLecture._id,
      targetType: 'lecture',
      text: 'Course ' + this.course.name + ' has a new lecture.'
    });
    await this.reloadCourse();
  }

  async reloadCourse() {
    try {
      this.course = await this.courseService.readCourseToEdit(this.course._id);
      this.dataSharingService.setDataForKey('course', this.course);
    } catch (err) {
      this.snackBar.open('Couldn\'t reload Course', '', {duration: 3000});
    }
    return this.showProgress.toggleLoadingGlobal(false);
  }

  onImportLecture = () => {
    this.dialogService
      .chooseFile('Choose a lecture.json to import',
        '/api/import/lecture/' + this.course._id)
      .subscribe(res => {
        if (res.success) {
          this.reloadCourse();
          // This does not work as expected
          this.dataSharingService.setDataForKey('unit-edit-element', res.result);
          this.dataSharingService.setDataForKey('unit-edit-mode', true);
          this.snackBar.open('Lecture successfully imported', '', {duration: 3000});
        } else if (res.result) {
          this.snackBar.open(res.error.message, '', {duration: 3000});
        }
      });
  }

  onAddLecture() {
    this.onCloseAllForms.next();
    this.dataSharingService.setDataForKey('openLectureId', null);

    this.dataSharingService.setDataForKey('lecture-create-mode', true);
    this.route.url.subscribe(segments => {
      let path = segments.map(() => '../').join('') || '';
      path += 'lecture/add';
      this.router.navigate([path], {relativeTo: this.route});
    });
  }

  onAddUnit = (type: string) => {
    this.onCloseAllForms.next();

    this.dataSharingService.setDataForKey('unit-create-mode', true);
    this.dataSharingService.setDataForKey('unit-create-type', type);
    const lectureId = this.dataSharingService.getDataForKey('openLectureId');
    this.route.url.subscribe(segments => {
      let path = segments.map(() => '../').join('') || '';
      path += `lecture/${lectureId}/unit/add/${type}`;
      this.router.navigate([path], {relativeTo: this.route});
    });
  }

  onImportUnit = () => {
    const openLectureId = this.dataSharingService.getDataForKey('openLectureId');
    this.dialogService
      .chooseFile('Choose a unit.json to import',
        '/api/import/unit/' + this.course._id + '/' + openLectureId)
      .subscribe(async res => {
        if (res.success) {
          this.reloadCourse();
          // This does not work as expected
          const lecture = res.result;
          this.dataSharingService.setDataForKey('openLectureId', lecture._id);
          this.dataSharingService.setDataForKey('lecture-edit-mode', true);
          this.snackBar.open('Unit successfully imported', '', {duration: 3000});
        } else if (res.result) {
          this.snackBar.open(res.error.message, '', {duration: 3000});
        }
      });
  }

  closeFab = () => {
    this.fabOpen = false;
  }

  onFabClick = () => {
    this.fabOpen = !this.fabOpen;
  }

  closeAddLecture = () => {
    this.dataSharingService.setDataForKey('lecture-create-mode', false);
  }

  private closeAllForms() {
    this.closeFab();
    this.closeAddLecture();
  }
}
