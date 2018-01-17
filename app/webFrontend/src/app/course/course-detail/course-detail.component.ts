import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import 'rxjs/add/operator/switchMap';
import {CourseService, UserDataService} from '../../shared/services/data.service';
import {ICourse} from '../../../../../../shared/models/ICourse';
import {UserService} from '../../shared/services/user.service';
import {MatSnackBar, MatDialog} from '@angular/material';
import {DownloadCourseDialogComponent} from './download-course-dialog/download-course-dialog.component';
import {TitleService} from '../../shared/services/title.service';

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.scss']
})
export class CourseDetailComponent implements OnInit {

  course: ICourse;

  id: string;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private courseService: CourseService,
              public userService: UserService,
              private snackBar: MatSnackBar,
              private dialog: MatDialog,
              private titleService: TitleService,
              private userDataService: UserDataService) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = decodeURIComponent(params['id']);
    });
    this.getCourse(this.id);
    this.titleService.setTitle('Course');
  }

  getCourse(courseId: string) {
    this.courseService.readSingleItem(courseId).then(
      (course: any) => {
        this.course = course;
        this.updateLastVisitedCourses();
        this.titleService.setTitleCut(['Course: ', this.course.name]);
      },
      (errorResponse: Response) => {
        if (errorResponse.status === 401) {
          this.snackBar.open('You are not authorized to view this course.', '', {duration: 3000});
        }
      });
  }

  updateLastVisitedCourses() {
    const user = this.userService.user;
    console.log(user.lastVisitedCourses);
    user.lastVisitedCourses.push(this.course._id);
    console.log(user.lastVisitedCourses);
    this.userDataService.updateItem(user)
      .then((updatedUser) => {
        console.log(updatedUser.lastVisitedCourses);
        this.userService.setUser(updatedUser);
      });
  }

  openDownloadDialog() {
    const diaRef = this.dialog.open(DownloadCourseDialogComponent, {
      data: {course: this.course},
      width: '800px'
    });
  }
}
