import {Component, Input, OnInit} from '@angular/core';
import {ICourse} from '../../../../../../../shared/models/ICourse';

@Component({
  selector: 'app-course-mediamanager',
  templateUrl: './course-mediamanager.component.html',
  styleUrls: ['./course-mediamanager.component.scss']
})
export class CourseMediamanagerComponent implements OnInit {
  @Input() course: ICourse;
  detailBarVisible: boolean;

  constructor() { }

  ngOnInit() {
    this.detailBarVisible = true;
  }

  isDetailBarVisible(): boolean {
    return this.detailBarVisible;
  }

  toggleDetailBarVisible(): void {
    this.detailBarVisible = !this.detailBarVisible;
  }

}
