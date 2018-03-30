import {Injectable} from '@angular/core';
import {DataService} from '../data.service';
import {BackendService} from '../backend.service';
import {IUser} from '../../../../../../../shared/models/IUser';

@Injectable()
export class ReportService extends DataService {
  constructor(public backendService: BackendService) {
    super('report/', backendService);
  }

  getCourseOverview(courseId: string) {
    const originalApiPath = this.apiPath;
    this.apiPath += 'overview/courses/';
    const promise = this.readSingleItem(courseId);
    this.apiPath = originalApiPath;
    return promise;
  }

  getCourseResults(courseId: string) {
    const originalApiPath = this.apiPath;
    this.apiPath += 'result/courses/';
    const promise = this.readSingleItem<any>(courseId);
    this.apiPath = originalApiPath;
    return promise;
  }

  getUnitDetailForCourse(courseId: string, unitId: string) {
    const originalApiPath = this.apiPath;
    this.apiPath += 'details/courses/' + courseId + '/units/';
    // FIXME: Why do we expect an array?
    const promise = this.readSingleItem<IUser[]>(unitId);
    this.apiPath = originalApiPath;
    return promise;
  }

  getUserOverview(userId: string) {
    const originalApiPath = this.apiPath;
    this.apiPath += 'overview/users/';
    const promise = this.readSingleItem(userId);
    this.apiPath = originalApiPath;
    return promise;
  }
}
