import {Component, EventEmitter, Input, Output, OnInit, ViewEncapsulation} from '@angular/core';
import {MatDialog, MatSnackBar} from '@angular/material';
import {UserService} from '../../shared/services/user.service';
import {CourseService} from '../../shared/services/data.service';
import {Router} from '@angular/router';
import {ICourse} from '../../../../../../shared/models/ICourse';


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

  constructor(public userService: UserService,
              private courseService: CourseService,
              private router: Router,
              private dialog: MatDialog,
              private snackBar: MatSnackBar) {

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
      this.snackBar.open('Successfully enrolled', '', {duration: 5000});
      // reload courses to update enrollment status
      this.onEnroll.emit();
    }).catch((err) => {
      this.snackBar.open(`${err.statusText}: ${JSON.parse(err._body).message}`, '', {duration: 5000});
    });
  }

}
