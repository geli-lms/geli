import {Component, Input, OnInit, OnDestroy} from '@angular/core';
import {ICourse} from '../../../../../../../shared/models/ICourse';
import {ILecture} from '../../../../../../../shared/models/ILecture';
import {
  CourseService, DuplicationService, ExportService, ImportService, LectureService,
  UnitService
} from '../../../shared/services/data.service';
import {ShowProgressService} from 'app/shared/services/show-progress.service';
import {DialogService} from '../../../shared/services/dialog.service';
import {UserService} from '../../../shared/services/user.service';
import {MatSnackBar} from '@angular/material';
import {IUnit} from '../../../../../../../shared/models/units/IUnit';
import {DragulaService} from 'ng2-dragula';
import {SaveFileService} from '../../../shared/services/save-file.service';

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
              private duplicationService: DuplicationService,
              private exportService: ExportService,
              private saveFileService: SaveFileService,
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

  isDraggingUnit() {
    return this.dragulaService.find('units').drake.dragging;
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
    this.duplicationService.duplicateLecture(lecture, this.course._id)
      .then(() => {
        this.snackBar.open('Lecture duplicated.', '', {duration: 3000});
        this.reloadCourse();
      })
      .catch((error) => {
      this.snackBar.open(error, '', {duration: 3000});
    });
  }

  duplicateUnit(unit: IUnit) {
    this.duplicationService.duplicateUnit(unit, this.openedLecture._id , this.course._id)
    .then(() => {
      this.snackBar.open('Unit duplicated.', '', {duration: 3000});
      this.reloadCourse();
    })
    .catch((error) => {
      this.snackBar.open(error, '', {duration: 3000});
    });
  }

  async exportLecture(lecture: ILecture) {
    try {
      const lectureJSON = await this.exportService.exportLecture(lecture);

      this.saveFileService.save(lecture.name, JSON.stringify(lectureJSON, null, 2));
    } catch (err) {
      this.snackBar.open('Export lecture failed ' + err.json().message, 'Dismiss');
    }
  }

  deleteObjectIds(object: any) {
    if (object != null && typeof(object) !== 'string' && typeof(object) !== 'boolean' && typeof(object) !== 'number') {
      // object.length is undefined, if the object isn't an array.
      // go through all properties recursively and delete all _ids
      if (typeof(object.length) === 'undefined') {
        delete object._id;
        Object.keys(object).forEach(key => {
          this.deleteObjectIds(object[key]);
        } );
      } else {
        // iterate through all sub-objects
        for (let i = 0; i < object.length; i++) {
          this.deleteObjectIds(object[i]);
        }
      }
    }
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
    return this.courseService.readSingleItem(this.course._id)
    .then((val: any) => {
      this.course = val;
    })
    .catch((error) => {
      this.snackBar.open('Couldn\'t reload Course', '', {duration: 3000});
    })
    .then(() => {
      this.showProgress.toggleLoadingGlobal(false)
    });
  }

  onImportLecture = () => {
    this.dialogService
      .chooseFile('Choose a lecture.json to import',
        '/api/import/lecture/' + this.course._id)
      .subscribe(res => {
        if (res.success) {
          this.reloadCourse();
          // This does not work as expected
          this.unitEditElement = res.result;
          this.unitEditMode = true;
          this.snackBar.open('Lecture successfully imported', '', {duration: 3000});
        } else if (res.result) {
          this.snackBar.open(res.error.message, '', {duration: 3000});
        }
      });
  };

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

  onImportUnit = () => {
    this.dialogService
      .chooseFile('Choose a unit.json to import',
        '/api/import/unit/' + this.course._id + '/' + this.openedLecture._id)
      .subscribe(async res => {
        if (res.success) {
          this.reloadCourse();
          // This does not work as expected
          this.openedLecture = res.result;
          this.lectureEditMode = true;
          this.snackBar.open('Unit successfully imported', '', {duration: 3000});
        } else if (res.result) {
          this.snackBar.open(res.error.message, '', {duration: 3000});
        }
      });
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

  onExportUnit = async (unit: IUnit) => {
    try {
      const unitJSON = await this.exportService.exportUnit(unit);

      this.saveFileService.save(unit.name, JSON.stringify(unitJSON, null, 2));
    } catch (err) {
      this.snackBar.open('Export unit failed ' + err.json().message, 'Dismiss');
    }
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
