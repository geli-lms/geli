import {Component, Input, OnInit} from '@angular/core';
import {ICourse} from '../../../../../../../shared/models/ICourse';
import {ILecture} from '../../../../../../../shared/models/ILecture';
import {CourseService, LectureService, UnitService} from '../../../shared/services/data.service';
import {ShowProgressService} from 'app/shared/services/show-progress.service';
import {DialogService} from '../../../shared/services/dialog.service';
import {UserService} from '../../../shared/services/user.service';
import {MdSnackBar} from '@angular/material';
import {IUnit} from '../../../../../../../shared/models/units/IUnit';
import {DragulaService} from "ng2-dragula";

@Component({
  selector: 'app-course-manage-content',
  templateUrl: './course-manage-content.component.html',
  styleUrls: ['./course-manage-content.component.scss']
})
export class CourseManageContentComponent implements OnInit {

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
              private snackBar: MdSnackBar,
              private dialogService: DialogService,
              private dragulaService: DragulaService,
              public userService: UserService) {
  }

  ngOnInit() {
    this.dragulaService.setOptions('lectures', {
      moves: (el, container, handle) => {
        return /(.* )?lecture-drag-handle(.* )?/.test(handle.className);
      }
    });
    this.dragulaService.setOptions('units', {
      moves: (el, container, handle) => {
        return /(.* )?unit-drag-handle(.* )?/.test(handle.className);
      }
    });
  }

  duplicateLecture(lecture: ILecture) {
    delete lecture._id;

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
      .delete('unit', unit.type)
      .subscribe(res => {
        if (res) {
          this.showProgress.toggleLoadingGlobal(true);
          this.unitService.deleteItem(unit).then(
            () => {
              this.showProgress.toggleLoadingGlobal(false);
              this.snackBar.open('Unit deleted.', '', {duration: 3000});
              this.reloadCourse();
            },
            (error) => {
              this.showProgress.toggleLoadingGlobal(false);
              this.snackBar.open(error, '', {duration: 3000});
            }
          );
        }
      });
  }

  deleteLecture(lecture: ILecture) {
    this.dialogService
      .delete('lecture', lecture.name)
      .subscribe(res => {
        if (res) {
          this.showProgress.toggleLoadingGlobal(true);
          this.lectureService.deleteItem(lecture).then(
            (val) => {
              this.showProgress.toggleLoadingGlobal(false);
              this.snackBar.open('Lecture deleted.', '', {duration: 3000});
              this.reloadCourse();
            },
            (error) => {
              this.showProgress.toggleLoadingGlobal(false);
              this.snackBar.open(error, '', {duration: 3000});
            }
          );
        }
      });
  }

  reloadCourse() {
    this.courseService.readSingleItem(this.course._id).then(
      (val: any) => {
        this.course = val;
      }, (error) => {
        console.log(error);
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
  }

  onAddUnit = (type: string) => {
    this.closeAllForms();

    this.unitCreateMode = true;
    this.unitCreateType = type;
  }

  onAddUnitDone = () => {
    this.reloadCourse();
    this.closeAddUnit();
  }

  closeAddUnit = () => {
    this.unitCreateMode = false;
    this.unitCreateType = null;
  }

  onEditUnit = (unit: IUnit) => {
    this.closeAllForms();

    this.unitEditMode = true;
    this.unitEditElement = unit;
  }

  onEditUnitDone = () => {
    this.reloadCourse();
    this.closeEditUnit();
  }

  closeEditUnit = () => {
    this.unitEditMode = false;
    this.unitEditElement = null;
  }

  closeFab = () => {
    this.fabOpen = false;
  }

  onFabClick = () => {
    this.fabOpen = !this.fabOpen;
  }

  closeAddLecture = () => {
    this.lectureCreateMode = false;
  }

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
