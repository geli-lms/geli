import {Component, EventEmitter, Input, Output, OnInit, ViewEncapsulation} from '@angular/core';
import {MatDialog, MatSnackBar} from '@angular/material';
import {UserService} from '../../shared/services/user.service';
import {CourseService, UserDataService} from '../../shared/services/data.service';
import {Router} from '@angular/router';
import {ICourse} from '../../../../../../shared/models/ICourse';
import {errorCodes} from '../../../../../../api/src/config/errorCodes';
import {UserUtil} from '../../shared/utils/userUtil';

@Component({
  selector: 'app-course-container',
  templateUrl: './course-container.component.html',
  styleUrls: ['./course-container.component.scss']
})

export class CourseContainerComponent implements OnInit {
  @Input()
  courses: ICourse[];
  @Input()
  expand: boolean;
  @Input()
  title: string;

  @Output()
  onEnroll = new EventEmitter();
  @Output()
  onLeave = new EventEmitter();

  constructor(public userService: UserService,
              private courseService: CourseService,
              private router: Router,
              private dialog: MatDialog,
              private snackBar: MatSnackBar,
              private userDataService: UserDataService) {

  }

  ngOnInit() {
  }

  changeExpand() {
      this.expand = !this.expand;
  }

  enrollCallback({courseId, accessKey}) {
    this.courseService.enrollStudent(courseId, {
      user: this.userService.user,
      accessKey
    }).then((res) => {
      UserUtil.addCourseToLastVisitedCourses(courseId, this.userService, this.userDataService);
      this.snackBar.open('Successfully enrolled', '', {duration: 5000});
      // reload courses to update enrollment status
      this.onEnroll.emit();
    }).catch((error) => {
      const errormessage = error.error.message;
      switch (errormessage) {
        case errorCodes.course.accessKey.code: {
          this.snackBar.open(`${errorCodes.course.accessKey.text}`, 'Dismiss');
          break;
        }
        case errorCodes.course.notOnWhitelist.code: {
          this.snackBar.open(`${errorCodes.course.notOnWhitelist.text}`, 'Dismiss');
          break;
        }
        default: {
          this.snackBar.open('Enroll failed', '', {duration: 5000});
        }
      }
    });
  }

  leaveCallback({courseId}) {
    this.courseService.leaveStudent(courseId).then((res) => {
      // reload courses to update enrollment status
      this.onLeave.emit();
    }).catch((err) => {
      this.snackBar.open(`${err.statusText}: ${JSON.parse(err._body).message}`, '', {duration: 5000});
    });
  }
}
