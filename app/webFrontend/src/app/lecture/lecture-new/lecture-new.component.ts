import {Component, OnInit} from '@angular/core';
import {LectureService} from '../../shared/services/data.service';
import {Router, ActivatedRoute} from '@angular/router';
import {ILecture} from '../../../../../../shared/models/ILecture';

@Component({
  selector: 'app-lecture-new',
  templateUrl: './lecture-new.component.html',
  styleUrls: ['./lecture-new.component.scss']
})
export class LectureNewComponent implements OnInit {
  courseId: string;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private lectureService: LectureService) {

    this.route.params.subscribe(params => {
      this.courseId = params['id'];
    });
  }

  ngOnInit() {
  }

  createLecture(lecture: ILecture) {
    this.lectureService.createItem({courseId: this.courseId, lecture: lecture})
      .then(() => {
        this.router.navigate(['/course', 'detail', this.courseId]);
      })
      .catch(console.error);
  }
}
