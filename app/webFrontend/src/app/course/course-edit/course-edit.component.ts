import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {TitleService} from '../../shared/services/title.service';
import {DialogService} from "../../shared/services/dialog.service";

@Component({
  selector: 'app-course-edit',
  templateUrl: './course-edit.component.html',
  styleUrls: ['./course-edit.component.scss']
})
export class CourseEditComponent implements OnInit {

  id: string;
  tabs = [
    { path: '.', label: 'General' },
    { path: 'content', label: 'Content' },
    { path: 'media', label: 'Media' },
    { path: 'members', label: 'Members' },
    { path: 'teachers', label: 'Teachers' },
  ];

  constructor(private route: ActivatedRoute,
              private titleService: TitleService) {
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });
  }

  ngOnInit() {
    this.titleService.setTitle('Edit Course');
  }

}
