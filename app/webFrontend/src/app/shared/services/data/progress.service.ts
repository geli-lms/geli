import {Injectable} from '@angular/core';
import {DataService} from '../data.service';
import {BackendService} from '../backend.service';

@Injectable()
export class ProgressService extends DataService {
  constructor(public backendService: BackendService) {
    super('progress/', backendService);
  }

  async getUnitProgress<T>(unitId: string): Promise<T> {
    const unitProgress = await this.readSingleItem<any>(unitId, this.apiPath + 'units/');
    const objectIsEmpty = Object.keys(unitProgress).length === 0 && unitProgress.constructor === Object;
    return objectIsEmpty ? null : unitProgress;
  }

  // The corresponding route has been disabled since it appears to be unused and insufficiently secured.
  /*
  getCourseProgress(courseId: string) {
    const originalApiPath = this.apiPath;
    this.apiPath += 'courses/';
    const promise = this.readSingleItem(courseId);
    this.apiPath = originalApiPath;
    return promise;
  }
  */

  // The corresponding route has been disabled since it appears to be unused and insufficiently secured.
  /*
  getUserProgress(userId: string) {
    const originalApiPath = this.apiPath;
    this.apiPath += 'users/';
    const promise = this.readSingleItem(userId);
    this.apiPath = originalApiPath;
    return promise;
  }
  */
}
