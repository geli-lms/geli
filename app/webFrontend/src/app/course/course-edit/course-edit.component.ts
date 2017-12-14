import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {TitleService} from '../../shared/services/title.service';

@Component({
  selector: 'app-course-edit',
  templateUrl: './course-edit.component.html',
  styleUrls: ['./course-edit.component.scss']
})
export class CourseEditComponent implements OnInit {

  constructor(private router: Router,
              private titleService: TitleService) {
  }

  ngOnInit() {
    this.titleService.setTitle('Edit Course');
  }

  cancel() {
    this.router.navigate(['/']);
  }



}
