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

  updateProgress<T extends any>(updateItem: T): Promise<T> {
    return this.backendService
      .put(this.apiPath, JSON.stringify(updateItem))
      .toPromise();
  }
}
