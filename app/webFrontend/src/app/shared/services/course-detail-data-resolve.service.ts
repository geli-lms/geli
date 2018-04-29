import {Injectable} from '@angular/core';
import {CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot, Resolve, ActivatedRoute} from '@angular/router';
import {AuthenticationService} from './authentication.service';
import {UserService} from './user.service';
import {ICourse} from '../../../../../../shared/models/ICourse';
import {LastVisitedCourseContainerUpdater} from '../utils/LastVisitedCourseContainerUpdater';
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

  resolve(route: ActivatedRouteSnapshot): Observable<ICourse> {
    const id = route.paramMap.get('id');
    this.courseService.readSingleItem(id).then(
      (course: any) => {
        return Observable.of(course);
      },(errorResponse: Response) => {
        if (errorResponse.status === 401) {
          this.snackBar.open('You are not authorized to view this course.', '', {duration: 3000});
        }
        if (errorResponse.status === 404) {
          this.snackBar.open('Your selected course is not available.', '', {duration: 3000});
          this.router.navigate(['/not-found']);

        }
      });
    return Observable.empty();
  }
}
