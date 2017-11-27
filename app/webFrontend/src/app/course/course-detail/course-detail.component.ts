import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import 'rxjs/add/operator/switchMap';
import {CourseService} from '../../shared/services/data.service';
import {ICourse} from '../../../../../../shared/models/ICourse';
import {UserService} from '../../shared/services/user.service';
import {MatSnackBar, MatDialog} from '@angular/material';
import {SelectUnitDialogComponent} from './select-unit-dialog/select-unit-dialog.component';
import {SelectedUnitsService} from "../../shared/services/selected-units.service";


@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.scss']
})
export class CourseDetailComponent implements OnInit {

  course: ICourse;
  id: string;


  constructor(private router: Router,
              private route: ActivatedRoute,
              private courseService: CourseService,
              public userService: UserService,
              private snackBar: MatSnackBar,
              private dialog: MatDialog,
              private selectedUnitsService: SelectedUnitsService) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = decodeURIComponent(params['id']);
    });
    this.getCourse(this.id);
  }

  getCourse(courseId: string) {
    this.courseService.readSingleItem(courseId).then(
      (course: any) => {
        this.course = course;
      },
      (errorResponse: Response) => {
        if (errorResponse.status === 401) {
          this.snackBar.open('You are not authorized to view this course.', '', {duration: 3000});
        }
      });
  }

  openDownloadDialog() {
    let diaRef = this.dialog.open(SelectUnitDialogComponent, {
      data: {course: this.course}
    });
    diaRef.afterClosed().subscribe(() => {
      //console.log('AfterDialogClose');
      this.selectedUnitsService.clearData();
    });
  }

  apply() {
    console.log('apply');
  }
}
