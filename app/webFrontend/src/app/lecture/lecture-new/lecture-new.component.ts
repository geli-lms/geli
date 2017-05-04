import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LectureService} from '../../shared/data.service';
import {Router, ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-lecture-new',
  templateUrl: './lecture-new.component.html',
  styleUrls: ['./lecture-new.component.scss']
})
export class LectureNewComponent implements OnInit {
  newLecture: FormGroup;
  id: string;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private formBuilder: FormBuilder,
              private lectureService: LectureService) {

    this.route.params.subscribe(params => {
      this.id = params['id'];
    });
  }

  ngOnInit() {
    this.generateForm();
  }

  createLecture() {
    console.log(this.newLecture.value);
    this.lectureService.createItem({courseId: this.id, lecture: this.newLecture.value})
      .then((val) => {
        const url = `/course/edit/${this.id}`;
        console.log(url);
        this.router.navigate([url]);
      }, (error) => {
        console.log(error);
      });
  }

  generateForm() {
    this.newLecture = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

}
