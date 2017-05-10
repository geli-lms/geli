import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {LectureService} from '../../shared/services/data.service';
import {ShowProgressService} from '../../shared/services/show-progress.service';
import {ILecture} from "../../../../../../shared/models/ILecture";

@Component({
  selector: 'app-lecture-edit',
  templateUrl: './lecture-edit.component.html',
  styleUrls: ['./lecture-edit.component.scss']
})
export class LectureEditComponent implements OnInit {

  name: string;
  description: string;
  courseId: string;
  lectureId: string;
  lecture: any[];

  constructor(private router: Router,
              private route: ActivatedRoute,
              private lectureService: LectureService,
              private showProgress: ShowProgressService) {

    this.route.params.subscribe(params => {
      this.courseId = params['courseId'];
      this.lectureId = params['lectureId'];
    });
  }

  ngOnInit() {
    this.lectureService.readSingleItem(this.lectureId)
      .then((val: any) => {
        this.lecture = val;
      })
      .catch(console.error);
  }

  updateLecture(lecture: ILecture) {
    this.showProgress.toggleLoadingGlobal(true);

    this.lectureService.updateItem(lecture)
      .catch(console.error)
      .then(() => this.router.navigate(['/course', 'detail', this.courseId]))
      .then(() => this.showProgress.toggleLoadingGlobal(false));
  }
}
