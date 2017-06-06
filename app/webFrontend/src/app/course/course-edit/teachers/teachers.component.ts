import {Component, Input, OnInit} from '@angular/core';
import {User} from '../../../models/User';
import {CourseService, UserDataService} from '../../../shared/services/data.service';
import {IUser} from '../../../../../../../shared/models/IUser';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-teachers',
  templateUrl: './teachers.component.html',
  styleUrls: ['./teachers.component.scss']
})
export class TeachersComponent implements OnInit {

  @Input() courseId;
  allTeachers: User[];
  courseTeachers: User[];
  // fuzzySearch: String = '';
  // userCtrl: FormControl;*/

  constructor(private courseService: CourseService,
              private userService: UserDataService) {
    ;
   // this.userCtrl = new FormControl();

  }

  ngOnInit() {
    this.getAllTeachers();
    this.getCourseTeachers();
  }

  getAllTeachers() {
    this.userService.getUsersByRole('teacher').then(
      teachers => {
        this.allTeachers = teachers;
        console.log('AllTeachers:');
        console.log(this.allTeachers);
      }
    );
  }

  getCourseTeachers() {
    this.courseService.getTeachers(this.courseId).then(
      teachers => {
        this.courseTeachers = teachers;
        console.log('Course Teachers:');
        console.log(this.courseTeachers);
      }
    );
  }
}
