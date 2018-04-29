import {Injectable} from '@angular/core';
import {CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot, Resolve, ActivatedRoute} from '@angular/router';
import {UserService} from './user.service';
import {ICourse} from '../../../../../../shared/models/ICourse';
import {CourseService, UserDataService} from './data.service';
import {MatSnackBar} from '@angular/material';
import {DataSharingService} from './data-sharing.service';
import {Observable} from 'rxjs/Rx';

@Injectable()
export class CourseDetailDataResolve implements Resolve<ICourse> {

  constructor(private courseService: CourseService,
              private router: Router,
              private userDataService: UserDataService,
              public userService: UserService,
              private snackBar: MatSnackBar,
              private shareDataService: DataSharingService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<ICourse> {
    const id = route.paramMap.get('id');
    return this.courseService.readSingleItem(id).then(
      (course: any) => {
        this.shareDataService.setDataForKey('course', course);
        return course;
      }, (errorResponse: Response) => {
        if (errorResponse.status === 401) {
          this.snackBar.open('You are not authorized to view this course.', '', {duration: 3000});
        }
        if (errorResponse.status === 404) {
          this.snackBar.open('Your selected course is not available.', '', {duration: 3000});
          this.router.navigate(['/not-found']);
        }
      });
  }
}
