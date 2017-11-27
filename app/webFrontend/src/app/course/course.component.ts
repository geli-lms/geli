import {Component, EventEmitter, Input, Output} from '@angular/core';
import 'rxjs/add/operator/switchMap';
import {UserService} from '../shared/services/user.service';
import {ICourse} from '../../../../../shared/models/ICourse';
import {Router} from '@angular/router';
import {MatDialog, MatSnackBar} from '@angular/material';
import {AccessKeyDialog} from '../shared/components/access-key-dialog/access-key-dialog.component';
import {CourseService} from '../shared/services/data.service';
import {DialogService} from '../shared/services/dialog.service';
import {ShowProgressService} from '../shared/services/show-progress.service';



@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent {

  @Input()
  course: ICourse;

  @Output()
  onEnroll = new EventEmitter();
  onLeave = new EventEmitter();

  constructor(public userService: UserService,
              private router: Router,
              private dialog: MatDialog,
              private snackBar: MatSnackBar,
              private dialogService: DialogService,
              private showProgress: ShowProgressService,
              private courseService: CourseService) {
  }

  editCourse(id: string) {
    const url = '/course/' + id + '/edit';
    this.router.navigate([url]);
  }

  showReport(id: string) {
    const url = '/course/' + id + '/report';
    this.router.navigate([url]);
  }

  enroll() {
    // TODO: use correct interface
    if ((<any> this.course).hasAccessKey) {
      // open dialog for accesskey
      const dialogRef = this.dialog.open(AccessKeyDialog);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.onEnroll.emit({'courseId': this.course._id, 'accessKey': result});
        }
      });
    } else {
      this.onEnroll.emit({'courseId': this.course._id, 'accessKey': null});
    }
  }
  leave() {
    this.dialogService
      .confirm('Leave course ?', 'Do you really want to leave the course?', 'Leave')
      .subscribe(res => {
        if (res) {
          this.showProgress.toggleLoadingGlobal(true);
          this.courseService.leaveStudent(this.course._id)
            .then(() => {
              this.onLeave.emit({'courseId': this.course._id});
              this.snackBar.open('leave course', '', {duration: 3000});
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

  isCourseTeacherOrAdmin(course: ICourse) {
    if (this.userService.isStudent()) {
      return false;
    }
    if (this.userService.isAdmin()) {
      return true;
    }

    if (course.courseAdmin._id === this.userService.user._id) {
      return true;
    }

    return ( course.teachers.filter(teacher => teacher._id === this.userService.user._id).length)
  }

  isMemberOfCourse(course: ICourse) {
    const user = this.userService.user;
    return this.userService.isStudent() &&
      course.students.filter(obj => obj._id === user._id).length > 0;
  }
}
