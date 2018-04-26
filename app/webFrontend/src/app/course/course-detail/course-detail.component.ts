import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import 'rxjs/add/operator/switchMap';
import {CourseService, UserDataService} from '../../shared/services/data.service';
import {ICourse} from '../../../../../../shared/models/ICourse';
import {UserService} from '../../shared/services/user.service';
import {MatSnackBar, MatDialog} from '@angular/material';
import {DownloadCourseDialogComponent} from './download-course-dialog/download-course-dialog.component';
import {TitleService} from '../../shared/services/title.service';
import {LastVisitedCourseContainerUpdater} from '../../shared/utils/LastVisitedCourseContainerUpdater';

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

  async getCourse(courseId: string) {
    try {
      this.course = await this.courseService.readCourseToView(courseId);
      this.titleService.setTitleCut(['Course: ', this.course.name]);
      LastVisitedCourseContainerUpdater.addCourseToLastVisitedCourses(courseId, this.userService, this.userDataService);
    } catch (errorResponse) {
      if (errorResponse.status === 401) {
        this.snackBar.open('You are not authorized to view this course.', '', {duration: 3000});
      } else if (errorResponse.status === 404) {
        this.snackBar.open('Your selected course is not available.', '', {duration: 3000});
        this.router.navigate(['/not-found']);
      } else {
        this.snackBar.open('Something went wrong: ' + errorResponse.message, '', {duration: 3000});
      }
    }
  }

  openDownloadDialog() {
    const diaRef = this.dialog.open(DownloadCourseDialogComponent, {
      data: {course: this.course},
      width: '800px'
    });
  }
}
