import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import 'rxjs/add/operator/switchMap';
import {CourseService, UserDataService} from '../../shared/services/data.service';
import {ICourse} from '../../../../../../shared/models/ICourse';
import {UserService} from '../../shared/services/user.service';
import {User} from '../../models/User';
import {MatSnackBar, MatDialog} from '@angular/material';
import {TitleService} from '../../shared/services/title.service';
import {LastVisitedCourseContainerUpdater} from '../../shared/utils/LastVisitedCourseContainerUpdater';
import {DialogService} from '../../shared/services/dialog.service';
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
    {path: 'overview', label: 'Overview', img: 'school'},
    {path: 'fileview', label: 'Files', img: 'insert_drive_file'},
    {path: 'videoview', label: 'Videos', img: 'video_library'},
    {path: 'download', label: 'Download', img: 'get_app'}
  ];

  constructor(private router: Router,
              private route: ActivatedRoute,
              private courseService: CourseService,
              public userService: UserService,
              private snackBar: MatSnackBar,
              private dialog: MatDialog,
              private titleService: TitleService,
              private userDataService: UserDataService,
              private dialogService: DialogService,
              private dataSharingService: DataSharingService) {
  }

  ngOnInit() {
    const data: any = this.route.snapshot.data;
    this.course = <ICourse> data.course;
    this.id = this.course._id;
    LastVisitedCourseContainerUpdater.addCourseToLastVisitedCourses(this.id, this.userService, this.userDataService);
    this.titleService.setTitleCut(['Course: ', this.course.name]);
  }

  showUserProfile(teacher: User) {
    this.dialogService.userProfile(teacher);
  }

  ngOnDestroy() {
    this.dataSharingService.deleteDataForKey('course');
  }
}
