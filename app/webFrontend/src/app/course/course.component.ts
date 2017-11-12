import {Component, EventEmitter, Input, Output} from '@angular/core';
import 'rxjs/add/operator/switchMap';
import {UserService} from '../shared/services/user.service';
import {ICourse} from '../../../../../shared/models/ICourse';
import {Router} from '@angular/router';
import {MatDialog, MatSnackBar} from '@angular/material';
import {AccessKeyDialog} from '../shared/components/access-key-dialog/access-key-dialog.component';

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

  constructor(public userService: UserService,
              private router: Router,
              private dialog: MatDialog,
              private snackBar: MatSnackBar) {
  }

  editCourse(id: string) {
    const url = '/course/' + id + '/edit';
    this.router.navigate([url]);
  }

  showReport(id: string) {
    const url = '/course/' + id + '/report';
    this.router.navigate([url]);
  }

  apply(courseId: string, hasAccessKey: Boolean) {
    if (hasAccessKey) {
      // open dialog for accesskey
      const dialogRef = this.dialog.open(AccessKeyDialog);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.onEnroll.emit({'courseId': courseId, 'result': result});
        }
      });
    } else {
      this.onEnroll.emit({'courseId': courseId, 'result': null});
    }
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
