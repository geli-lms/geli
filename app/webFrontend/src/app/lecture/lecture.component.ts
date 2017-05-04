import {Component, OnInit, Input} from '@angular/core';
import {Router} from '@angular/router';
import {LectureService, CourseService} from '../shared/data.service';

@Component({
  selector: 'app-lecture',
  templateUrl: './lecture.component.html',
  styleUrls: ['./lecture.component.scss']
})
export class LectureComponent implements OnInit {

  @Input() course;

  constructor(private router: Router,
              private lectureService: LectureService,
              private courseService: CourseService) {
  }

  ngOnInit() {
  }

  createLecture() {
    const url = `course/edit/${this.course._id}/lecture/new`;
    this.router.navigate([url]);
  }

  duplicateLecture(id: string) {
    for (const lecture of this.course.lectures) {
      if (lecture._id === id) {
        delete lecture._id;
        this.lectureService.createItem({courseId: this.course._id, lecture: lecture})
          .then((val) => {
            this.updateCourseOb();
            const url = `course/edit/${this.course._id}/lecture/edit/${val._id}`;
            this.router.navigate([url]);
          }, (error) => {
            console.log(error);
          });
        break;
      }
    }
  }

  editLecture(id: string) {
    const url = `course/edit/${this.course._id}/lecture/edit/${id}`;
    this.router.navigate([url]);
  }

  deleteLecture(id: string) {
    this.lectureService.deleteItem({courseId: this.course._id, _id: id})
      .then(() => {
        this.updateCourseOb();
      }, (error) => {
        console.log(error);
      });
  }

  updateCourseOb() {
    this.courseService.readSingleItem(this.course._id).then(
      (val: any) => {
        this.course = val;
      }, (error) => {
        console.log(error);
      });
  }

}
