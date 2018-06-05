import {Component, OnDestroy, OnInit} from '@angular/core';
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
import {ChatNameInputComponent} from '../../shared/components/chat-name-input/chat-name-input.component';
import {ChatService} from '../../shared/services/chat.service';
import {DownloadCourseDialogComponent} from './download-course-dialog/download-course-dialog.component';


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
  showChat = false;
  chatName: string;

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
              private chatService: ChatService) {}

  ngOnInit() {
    const data: any = this.route.snapshot.data;
    this.course = <ICourse> data.course;
    this.id = this.course._id;
    LastVisitedCourseContainerUpdater.addCourseToLastVisitedCourses(this.id, this.userService, this.userDataService);
    this.titleService.setTitleCut(['Course: ', this.course.name]);
    this.route.params.subscribe(params => {
      this.id = decodeURIComponent(params['id']);
    });
    this.getCourse(this.id);
    this.titleService.setTitle('Course');

    this.chatService.chatName$.subscribe(name => {
       this.chatName = name;
    });
  }

  async getCourse(courseId: string) {
    try {
      this.course = await this.courseService.readCourseToView(courseId);
      this.titleService.setTitleCut(['Course: ', this.course.name]);
      LastVisitedCourseContainerUpdater.addCourseToLastVisitedCourses(courseId, this.userService, this.userDataService);
    } catch (err) {
      if (err.status === 404) {
        this.snackBar.open('Your selected course is not available.');
        this.router.navigate(['/not-found']);
      } else {
        this.snackBar.open('Something went wrong: ' + err.error.message);
      }
    }
  }

  openDownloadDialog() {
    const diaRef = this.dialog.open(DownloadCourseDialogComponent, {
      data: {course: this.course},
      width: '800px'
    });
  }

  showUserProfile(teacher: User) {
    this.dialogService.userProfile(teacher);
  }

  ngOnDestroy() {
    this.dataSharingService.deleteDataForKey('course');
  }
  /**
   * show or hide the chat
   */
  toggleChat() {
    this.showChat = !this.showChat;
  }

  /**
   * update user chat name
   */
  updateChatName() {
    const dialogRef = this.dialog.open(ChatNameInputComponent, {
      data: {chatName: this.chatName}
    });
  }
}
