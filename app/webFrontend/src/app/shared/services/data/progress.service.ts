import {Injectable} from '@angular/core';
import {DataService} from '../data.service';
import {BackendService} from '../backend.service';

@Injectable()
export class ProgressService extends DataService {
  constructor(public backendService: BackendService) {
    super('progress/', backendService);
  }

  getUnitProgress(unitId: string) {
    const originalApiPath = this.apiPath;
    this.apiPath += 'units/';
    const promise = this.readSingleItem(unitId);
    this.apiPath = originalApiPath;
    return promise;
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

@Injectable()
export class CodeKataProgressService extends DataService {
  constructor(public backendService: BackendService) {
    super('progress/code-katas/', backendService);
  }
}
