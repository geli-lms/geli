import {Component, OnInit, Input} from '@angular/core';
import {UserService} from '../shared/services/user.service';

@Component({
  selector: 'app-lecture',
  templateUrl: './lecture.component.html',
  styleUrls: ['./lecture.component.scss']
})
export class LectureComponent implements OnInit {

  @Input() course;
  @Input() lecture;

  constructor(public userService: UserService) {
  }

  ngOnInit() {
  }
}
