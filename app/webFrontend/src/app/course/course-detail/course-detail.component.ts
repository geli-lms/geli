import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {CourseService, UserDataService} from '../../shared/services/data.service';
import {ICourse} from '../../../../../../shared/models/ICourse';
import {UserService} from '../../shared/services/user.service';
import {User} from '../../models/User';
import {MatSnackBar, MatDialog} from '@angular/material';
import {TitleService} from '../../shared/services/title.service';
import {LastVisitedCourseContainerUpdater} from '../../shared/utils/LastVisitedCourseContainerUpdater';
import {DialogService} from '../../shared/services/dialog.service';
import {DataSharingService} from '../../shared/services/data-sharing.service';
import {TranslateService} from '@ngx-translate/core';



@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.scss']
})
export class CourseDetailComponent implements OnInit, OnDestroy {

  course: ICourse;
  id: string;
  tabs = [];

  constructor(private router: Router,
              private route: ActivatedRoute,
              private courseService: CourseService,
              public userService: UserService,
              private snackBar: MatSnackBar,
              private dialog: MatDialog,
              private titleService: TitleService,
              private userDataService: UserDataService,
              private dialogService: DialogService,
              private dataSharingService: DataSharingService,
              private translate: TranslateService) {}

  ngOnInit() {
    const data: any = this.route.snapshot.data;
    this.course = <ICourse> data.course;
    this.id = this.course._id;
    LastVisitedCourseContainerUpdater.addCourseToLastVisitedCourses(this.id, this.userService, this.userDataService);
    this.titleService.setTitleCut(['Course: ', this.course.name]);
    this.translate.onLangChange.subscribe(() => {
      this.reloadTabBar();
    });
    this.reloadTabBar();


  }

  reloadTabBar(): void {
    this.tabs.length = 0;
    this.translate.get(['common.content', 'common.documents', 'common.videos', 'common.download'])
      .subscribe((t: string) => {
        this.tabs = [{path: 'overview', label: t['common.content'], img: 'school'},
          {path: 'fileview', label: t['common.documents'], img: 'insert_drive_file'},
          {path: 'videoview', label: t['common.videos'], img: 'video_library'},
          {path: 'download', label: t['common.download'], img: 'get_app'}];
      });
  }

  showUserProfile(teacher: User) {
    this.dialogService.userProfile(teacher);
  }

  ngOnDestroy() {
    this.dataSharingService.deleteDataForKey('course');
  }

}
