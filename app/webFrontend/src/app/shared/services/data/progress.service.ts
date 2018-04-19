import {Injectable} from '@angular/core';
import {DataService} from '../data.service';
import {BackendService} from '../backend.service';

@Injectable()
export class ProgressService extends DataService {
  constructor(public backendService: BackendService) {
    super('progress/', backendService);
  }

  async getUnitProgress<T>(unitId: string): Promise<T> {
    // The readSingleItem method seems to always return an array. But we don't need an array, we should update
    // the progress and not add another progress field
    const unitProgress = await this.readSingleItem<any[]>(unitId, this.apiPath + 'units/');
    return unitProgress.length > 0 ? unitProgress[0] : null;
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
