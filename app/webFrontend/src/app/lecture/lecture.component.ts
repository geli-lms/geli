import {Component, OnInit, Input} from '@angular/core';
import {Router} from '@angular/router';
import {LectureService, CourseService} from '../shared/services/data.service';
import {DialogService} from '../shared/services/dialog.service';
import {ILecture} from '../../../../../shared/models/ILecture';
import {MdSnackBar} from '@angular/material';
import {ShowProgressService} from '../shared/services/show-progress.service';
import {UserService} from '../shared/services/user.service';

@Component({
  selector: 'app-lecture',
  templateUrl: './lecture.component.html',
  styleUrls: ['./lecture.component.scss']
})
export class LectureComponent implements OnInit {

  @Input() course;
  @Input() lecture;
  editMode: Boolean = false;
  unitType: string;

  constructor(private router: Router,
              private lectureService: LectureService,
              private courseService: CourseService,
              private showProgress: ShowProgressService,
              private snackBar: MdSnackBar,
              private dialogService: DialogService,
              public userService: UserService) {
  }

  ngOnInit() {
  }

  createLecture() {
    this.router.navigate(['/course', 'edit', this.course._id, 'lecture', 'new']);
  }

  duplicateLecture(lecture: ILecture) {
    delete lecture._id;

    this.lectureService.createItem({courseId: this.course._id, lecture: lecture})
      .then((val) => {
        const url = `course/edit/${this.course._id}/lecture/edit/${val._id}`;
        this.router.navigate([url]);
      }, (error) => {
        console.log(error);
      });
  }

  editLecture(lecture: ILecture) {
    this.router.navigate(['/course', 'edit', this.course._id, 'lecture', 'edit', lecture._id]);
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

  onAddUnit(type: string) {
    this.editMode = true;
    this.unitType = type;
  }

  onEditDone(done: boolean) {
    this.editMode = false;
  }
}
