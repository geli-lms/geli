import {Component, Input, OnInit} from '@angular/core';
import {ICourse} from "../../../../../../../shared/models/ICourse";
import {ILecture} from "../../../../../../../shared/models/ILecture";
import {CourseService, LectureService} from "../../../shared/services/data.service";
import {ShowProgressService} from "app/shared/services/show-progress.service";
import {DialogService} from "../../../shared/services/dialog.service";
import {UserService} from "../../../shared/services/user.service";
import {MdSnackBar} from "@angular/material";
import {IUnit} from "../../../../../../../shared/models/units/IUnit";

@Component({
  selector: 'app-course-manage-content',
  templateUrl: './course-manage-content.component.html',
  styleUrls: ['./course-manage-content.component.scss']
})
export class CourseManageContentComponent implements OnInit {

  constructor(private lectureService: LectureService,
              private courseService: CourseService,
              private showProgress: ShowProgressService,
              private snackBar: MdSnackBar,
              private dialogService: DialogService,
              public userService: UserService) {
  }

  openedLecture: ILecture;
  lectureCreateMode: boolean = false;
  lectureEditMode: boolean = false;
  unitCreateMode: boolean = false;
  unitCreateType: string;
  unitEditMode: boolean = false;
  unitEditElement: IUnit;
  @Input() course: ICourse;

  ngOnInit() {
  }

  duplicateLecture(lecture: ILecture) {
    delete lecture._id;

    this.lectureService.createItem({courseId: this.course._id, lecture: lecture})
      .then((val) => {
        this.reloadCourse();
      }, (error) => {
        console.log(error);
      });
  }

  createLecture(lecture:ILecture) {
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
      .delete('unit (deletion not yet implemented)', unit.type)
      .subscribe(res => {
        if (res) {
          // this.showProgress.toggleLoadingGlobal(true);
          // this.unitService.deleteItem(lecture).then(
          //   (val) => {
          //     this.showProgress.toggleLoadingGlobal(false);
          //     this.snackBar.open('Unit deleted.', '', {duration: 3000});
          //     this.reloadCourse();
          //   },
          //   (error) => {
          //     this.showProgress.toggleLoadingGlobal(false);
          //     this.snackBar.open(error, '', {duration: 3000});
          //   }
          // );
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
    this.lectureCreateMode = true
  }

  onEditLecture() {
    this.lectureEditMode = true
  }

  onAddUnit(type: string) {
    this.unitCreateMode = true;
    this.unitCreateType = type;
  }

  onAddUnitDone() {
    this.unitCreateMode = false;
    this.unitCreateType = null;
  }

  onEditUnit(unit: IUnit) {
    this.unitEditMode = true;
    this.unitEditElement = unit;
  }

  onEditUnitDone() {
    this.unitEditMode = false;
    this.unitEditElement = null;
  }

  openToggleLecture(lecture: ILecture) {
    if(this.openedLecture === lecture) {
      this.openedLecture = null;
    } else {
      this.openedLecture = lecture;
    }
  }
}
