import {Injectable} from '@angular/core';
import {DataService} from '../data.service';
import {BackendService} from '../backend.service';

@Injectable()
export class ReportService extends DataService {
  constructor(public backendService: BackendService) {
    super('report/', backendService);
  }

  getCourseProgress(courseId: string) {
    const originalApiPath = this.apiPath;
    this.apiPath += 'courses/';
    const promise = this.readSingleItem(courseId);
    this.apiPath = originalApiPath;
    return promise;
  }

  getUserProgress(userId: string) {
    const originalApiPath = this.apiPath;
    this.apiPath += 'users/';
    const promise = this.readSingleItem(userId);
    this.apiPath = originalApiPath;
    return promise;
  }
}
