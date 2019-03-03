import {Component, OnInit, Input, AfterViewInit} from '@angular/core';
import {UserService} from '../shared/services/user.service';
import {ICourse} from '../../../../../shared/models/ICourse';
import {ILecture} from '../../../../../shared/models/ILecture';
import {ExpandableDivHeaderTags} from '../shared/components/expandable-div/expandable-div-header-tags.enum';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-lecture',
  templateUrl: './lecture.component.html',
  styleUrls: ['./lecture.component.scss']
})
export class LectureComponent implements OnInit, AfterViewInit {

  @Input() course: ICourse;
  @Input() lecture: ILecture;
  @Input() opened: boolean;
  lectureId: string;
  private headerTags = ExpandableDivHeaderTags;

  constructor(public userService: UserService,
              private route: ActivatedRoute,
              private router: Router) {
    this.opened = true;
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.lectureId = decodeURIComponent(params['lecture']);
    });
  }

  ngAfterViewInit(): void {
    try {
      const element = document.getElementById(this.lectureId);
      if (element) {
        element.scrollIntoView();
      }
    } catch (err) {}
  }

  toggleOpen() {
    this.opened = !this.opened;
  }
}
