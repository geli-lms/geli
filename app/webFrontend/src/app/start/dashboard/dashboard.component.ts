import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {MdDialog, MdSnackBar} from '@angular/material';
import {UserService} from '../../shared/services/user.service';
import {CourseService} from '../../shared/services/data.service';
import {Router} from '@angular/router';
import {ICourse} from '../../../../../../shared/models/ICourse';
import {IUser} from '../../../../../../shared/models/IUser';
import {AccessKeyDialog} from '../../shared/components/access-key-dialog/access-key-dialog.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {

  allCourses: ICourse[];

  // UserService for HTML page
  constructor(public userService: UserService,
              private courseService: CourseService,
              private router: Router,
              private dialog: MdDialog,
              private snackBar: MdSnackBar) {
  }

  ngOnInit() {
    this.getCourses();
  }

  getCourses() {
    this.courseService.readItems().then(courses => {
      this.allCourses = courses;
    });
  }

  editCourse(id: string) {
    const url = '/course/edit/' + id;
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
          this.enrollCallback(courseId, result);
        }
      });
    } else {
      this.enrollCallback(courseId, null);
    }
  }

  enrollCallback(courseId: string, accessKey: string) {
    this.courseService.enrollStudent(courseId, {user: this.userService.user, accessKey}).then((res) => {
      this.snackBar.open('Successfully enrolled', '', { duration: 5000 });
      // reload courses to update enrollment status
      this.getCourses();
    }).catch((err) => {
      this.snackBar.open(`${err.statusText}: ${JSON.parse(err._body).message}`, '', { duration: 5000 });
    });
  }

  goToInfo(course: string) {
    const url = '/course/detail/' + course;
    this.router.navigate([url]);
  }

  isMemberOfCourse(students: IUser[]) {
    const user = this.userService.user;
    return students.filter(obj => obj._id === user._id).length > 0;
  }

  isTeacherOfCourse(course: ICourse): boolean {
    const user = this.userService.user;
    return (course.teachers.filter(obj => obj._id === user._id).length > 0) || (course.courseAdmin.filter(obj => obj._id === user._id).length > 0);
  }
}
