import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import 'rxjs/add/operator/switchMap';
import {CourseService, UserDataService} from '../../shared/services/data.service';
import {ICourse} from '../../../../../../shared/models/ICourse';
import {UserService} from '../../shared/services/user.service';
import {MatSnackBar, MatDialog} from '@angular/material';
import {DownloadCourseDialogComponent} from './download-course-dialog/download-course-dialog.component';
import {TitleService} from '../../shared/services/title.service';
import {LastVisitedCourseContainerUpdater} from '../../shared/utils/LastVisitedCourseContainerUpdater';
import {DataSharingService} from '../../shared/services/data-sharing.service';

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.scss']
})
export class CourseDetailComponent implements OnInit, OnDestroy {
  course: ICourse;
  id: string;
  tabs = [
    { path: 'overview', label: 'Overview' },
    { path: 'fileview', label: 'Fileview' }
  ];

  constructor(private router: Router,
              private route: ActivatedRoute,
              private courseService: CourseService,
              public userService: UserService,
              private snackBar: MatSnackBar,
              private dialog: MatDialog,
              private titleService: TitleService,
              private userDataService: UserDataService,
              private dataSharingService: DataSharingService) {
  }

  ngOnInit() {
      this.route.snapshot.data.course.then(course => {
        this.course = this.dataSharingService.getDataForKey('course');
        this.id = this.course._id;
        LastVisitedCourseContainerUpdater.addCourseToLastVisitedCourses(this.id, this.userService, this.userDataService);
        this.titleService.setTitleCut(['Course: ', this.course.name]);
      });
  }

  /*
  getCourse(courseId: string) {
    this.courseService.readSingleItem(courseId).then(
      (course: any) => {
        this.course = course;
        LastVisitedCourseContainerUpdater.addCourseToLastVisitedCourses(courseId, this.userService, this.userDataService);
        this.titleService.setTitleCut(['Course: ', this.course.name]);
        this.dataSharingService.setDataForKey('course', this.course);
        console.log('set course: ' + this.course.name);
      },
      (errorResponse: Response) => {
        if (errorResponse.status === 401) {
          this.snackBar.open('You are not authorized to view this course.', '', {duration: 3000});
        }
        if (errorResponse.status === 404) {
          this.snackBar.open('Your selected course is not available.', '', {duration: 3000});
          this.router.navigate(['/not-found']);
        }
      });
  }
*/

  ngOnDestroy() {
    this.dataSharingService.deleteDataForKey('course');
  }

  openDownloadDialog() {
    const diaRef = this.dialog.open(DownloadCourseDialogComponent, {
      data: {course: this.course},
      width: '800px'
    });
  }
}
