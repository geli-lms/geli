import {Injectable} from '@angular/core';
import {CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot, Resolve, ActivatedRoute} from '@angular/router';
import {UserService} from './user.service';
import {ICourse} from '../../../../../../shared/models/ICourse';
import {CourseService, UserDataService} from './data.service';
import {MatSnackBar} from '@angular/material';
import {DataSharingService} from './data-sharing.service';
import {Observable} from 'rxjs/Rx';

@Injectable()
export class CourseDetailDataResolve implements Resolve<Promise<ICourse>> {

  constructor(private courseService: CourseService,
              private router: Router,
              private userDataService: UserDataService,
              public userService: UserService,
              private snackBar: MatSnackBar,
              private shareDataService: DataSharingService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<ICourse> {
    const id = route.paramMap.get('id');
    return this.courseService.readSingleItem(id);
  }
}
