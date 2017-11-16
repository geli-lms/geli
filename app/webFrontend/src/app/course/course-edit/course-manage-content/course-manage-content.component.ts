import {Component, Input, OnInit, OnDestroy} from '@angular/core';
import {ICourse} from '../../../../../../../shared/models/ICourse';
import {ILecture} from '../../../../../../../shared/models/ILecture';
import {CourseService, LectureService, UnitService} from '../../../shared/services/data.service';
import {ShowProgressService} from 'app/shared/services/show-progress.service';
import {DialogService} from '../../../shared/services/dialog.service';
import {UserService} from '../../../shared/services/user.service';
import {MatSnackBar} from '@angular/material';
import {IUnit} from '../../../../../../../shared/models/units/IUnit';
import {DragulaService} from 'ng2-dragula';

@Component({
  selector: 'app-course-manage-content',
  templateUrl: './course-manage-content.component.html',
  styleUrls: ['./course-manage-content.component.scss']
})
export class CourseManageContentComponent implements OnInit, OnDestroy {

  @Input() course: ICourse;
  openedLecture: ILecture;
  lectureCreateMode = false;
  lectureEditMode = false;
  unitCreateMode = false;
  unitCreateType: string;
  unitEditMode = false;
  unitEditElement: IUnit;
  fabOpen = false;

  constructor(private lectureService: LectureService,
              private courseService: CourseService,
              private unitService: UnitService,
              private showProgress: ShowProgressService,
              private snackBar: MatSnackBar,
              private dialogService: DialogService,
              private dragulaService: DragulaService,
              public userService: UserService) {
  }

  ngOnInit() {
    // Make items only draggable by dragging the handle
    this.dragulaService.setOptions('lectures', {
      moves: (el, container, handle) => {
        return handle.classList.contains('lecture-drag-handle');
      }
    });
    this.dragulaService.setOptions('units', {
      moves: (el, container, handle) => {
        return handle.classList.contains('unit-drag-handle');
      }
    });

    this.dragulaService.dropModel.subscribe((value) => {
      const [bagName, element, target, container] = value;

      switch (bagName) {
        case 'lectures':
          this.updateLectureOrder();
          break;
        case 'units':
          // Update current lecture
          this.updateUnitOrder();

          // When dragging to another lecture we need to update the other lecture too
          if (target.dataset.lectureId) {
            this.updateUnitOrder(target.dataset.lectureId);
          }
          break;
      }
    });
  }

  ngOnDestroy() {
    this.dragulaService.destroy('lectures');
    this.dragulaService.destroy('units');
  }

  updateLectureOrder() {
    this.courseService.updateItem({
      '_id': this.course._id,
      'lectures': this.course.lectures.map((lecture) => lecture._id)
    });
  }

  updateUnitOrder(id: string = null) {
    let lecture;

    if (id) {
      lecture = this.course.lectures.filter(l => l._id === id)[0];
    } else {
      lecture = this.openedLecture;
    }

    this.lectureService.updateItem({
      '_id': lecture._id,
      'units': lecture.units.map((unit) => unit._id)
    });
  }

  duplicateLecture(lecture: ILecture) {
    delete lecture._id;
    delete lecture.units;

    this.lectureService.createItem({courseId: this.course._id, lecture: lecture})
    .then(() => {
      this.reloadCourse();
    }, (error) => {
      console.log(error);
    });
  }

  createLecture(lecture: ILecture) {
    this.lectureService.createItem({courseId: this.course._id, lecture: lecture})
    .then(() => {
      this.lectureCreateMode = false;
      return this.reloadCourse();
    })
    .catch(console.error);
  }

  updateLecture(lecture: ILecture) {
    this.showProgress.toggleLoadingGlobal(true);

    this.lectureService.updateItem(lecture)
    .then(() => {
      this.lectureEditMode = false;
    })
    .catch(console.error)
    .then(() => this.showProgress.toggleLoadingGlobal(false));
  }

  deleteUnit(unit: IUnit) {
    this.dialogService
    .confirmDelete('unit', unit.type)
    .subscribe(res => {
      if (res) {
        this.showProgress.toggleLoadingGlobal(true);
        this.unitService.deleteItem(unit)
        .then(() => {
          this.snackBar.open('Unit deleted.', '', {duration: 3000});
          this.closeEditUnit();
          this.reloadCourse();
        })
        .catch((error) => {
          this.snackBar.open(error, '', {duration: 3000});
        })
        .then(() => {
          this.showProgress.toggleLoadingGlobal(false);
        });
      }
    });
  }

  deleteLecture(lecture: ILecture) {
    this.dialogService
    .confirmDelete('lecture', lecture.name)
    .subscribe(res => {
      if (res) {
        this.showProgress.toggleLoadingGlobal(true);
        this.lectureService.deleteItem(lecture)
        .then((val) => {
            this.snackBar.open('Lecture deleted.', '', {duration: 3000});
            this.closeEditUnit();
            this.closeEditLecture();
            this.reloadCourse();
        })
        .catch((error) => {
          this.snackBar.open(error, '', {duration: 3000});
        })
        .then(() => {
          this.showProgress.toggleLoadingGlobal(false);
        });
      }
    });
  }

  reloadCourse() {
    this.courseService.readSingleItem(this.course._id)
    .then((val: any) => {
      this.course = val;
    })
    .catch((error) => {
      console.log(error);
    })
    .then(() => {
      this.showProgress.toggleLoadingGlobal(false)
    });
  }

  onAddLecture() {
    this.closeAllForms();

    this.lectureCreateMode = true;
  }

  onEditLecture(lecture: ILecture) {
    this.closeAllForms();

    this.lectureEditMode = true;
    this.openedLecture = lecture;
  }

  closeEditLecture = () => {
    this.lectureEditMode = false;
  };

  onAddUnit = (type: string) => {
    this.closeAllForms();

    this.unitCreateMode = true;
    this.unitCreateType = type;
  };

  onAddUnitDone = () => {
    this.reloadCourse();
    this.closeAddUnit();
  };

  closeAddUnit = () => {
    this.unitCreateMode = false;
    this.unitCreateType = null;
  };

  onEditUnit = (unit: IUnit) => {
    this.closeAllForms();

    this.unitEditMode = true;
    this.unitEditElement = unit;
  };

  onEditUnitDone = () => {
    this.reloadCourse();
    this.closeEditUnit();
  };

  closeEditUnit = () => {
    this.unitEditMode = false;
    this.unitEditElement = null;
  };

  closeFab = () => {
    this.fabOpen = false;
  };

  onFabClick = () => {
    this.fabOpen = !this.fabOpen;
  };

  closeAddLecture = () => {
    this.lectureCreateMode = false;
  };

  private closeAllForms() {
    this.closeFab();
    this.closeAddLecture();
    this.closeEditLecture();
    this.closeAddUnit();
    this.closeEditUnit();
  }

  openToggleLecture(lecture: ILecture) {
    this.closeAllForms();

    if (this.openedLecture && this.openedLecture._id === lecture._id) {
      this.openedLecture = null;
    } else {
      this.openedLecture = lecture;
    }
  }
}
