import {Injectable} from '@angular/core';
import {BackendService} from './backend.service';
import {Dependency} from '../../about/licenses/dependency.model';
import {ITaskUnit} from '../../../../../../shared/models/units/ITaskUnit';
import {IFreeTextUnit} from '../../../../../../shared/models/units/IFreeTextUnit';

abstract class DataService {

  static changeStringProp2DateProp(item: any, prop: string) {
    if (item[prop] !== null) {
      item[prop] = (typeof item[prop] === 'string' ? new Date(item[prop]) : null);
    }
  }

  constructor(public apiPath: string,
              public backendService: BackendService,
              public changeProps2Date?: string[],
              public dependentID?: string) {
  }

  createItem(createItem: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.backendService.post(this.apiPath, JSON.stringify(createItem))
        .subscribe(
          (responseItem: any) => {
            resolve(responseItem);
          },
          error => reject(error)
        );
    });
  }

  readItems(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.backendService.get(this.apiPath)
        .subscribe(
          (responseItems: any) => {
            if (this.changeProps2Date) {
              responseItems.forEach(item => {
                this.changeProps2Date.forEach(prop => {
                  DataService.changeStringProp2DateProp(item, prop);
                });
              });
            }

            resolve(responseItems);
          },
          error => reject(error)
        );
    });
  }

  updateItem(updateItem: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.backendService.put(this.apiPath + updateItem._id, JSON.stringify(updateItem))
        .subscribe(
          (res) => {
            resolve(res);
          },
          error => reject(error)
        );
    });
  }

  deleteItem(deleteItem: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.backendService.delete(this.apiPath + deleteItem._id)
        .subscribe(
          () => {
            resolve();
          },
          error => reject(error)
        );
    });
  }

  readSingleItem(id: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.backendService.get(this.apiPath + id)
        .subscribe(
          (responseItems: any) => {
            if (this.changeProps2Date) {
              responseItems.forEach(item => {
                this.changeProps2Date.forEach(prop => {
                  DataService.changeStringProp2DateProp(item, prop);
                });
              });
            }

            resolve(responseItems);
          },
          error => reject(error)
        );
    });
  }
}

@Injectable()
export class CourseService extends DataService {
  constructor(public backendService: BackendService) {
    super('courses/', backendService);
  }

  enrollStudent(courseId: string, data: any): Promise<any[]> {
    const student: any = data.user;
    const accessKey: string = data.accessKey;
    return new Promise((resolve, reject) => {
      this.backendService.post(this.apiPath + courseId + '/enroll', JSON.stringify({user: student, accessKey}))
        .subscribe(
          (responseItem: any) => {
            resolve(responseItem);
          },
          error => reject(error)
        );
    });
  }
}

@Injectable()
export class TaskService extends DataService {
  constructor(public backendService: BackendService) {
    super('tasks/', backendService);
  }

  getTasksForCourse(id: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.backendService.get(this.apiPath + 'course/' + id)
        .subscribe(
          (responseItems: any) => {
            if (this.changeProps2Date) {
              responseItems.forEach(item => {
                this.changeProps2Date.forEach(prop => {
                  DataService.changeStringProp2DateProp(item, prop);
                });
              });
            }

            resolve(responseItems);
          },
          error => reject(error)
        );
    });
  }

  getTasksForUnit(id: string): Promise<any[]> {
    const promise = this.readSingleItem(id);
    return promise;
  }

}

@Injectable()
export class FreeTextService extends DataService {
  constructor(public backendService: BackendService) {
    super('units/free-texts/', backendService);
  }

  // TODO: CHANGE METHOD NAME
  getStuff(id: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.backendService.get(this.apiPath + 'course/' + id)
        .subscribe((responseItems: any) => {
            if (this.changeProps2Date) {
              responseItems.forEach(item => {
                this.changeProps2Date.forEach(prop => {
                  DataService.changeStringProp2DateProp(item, prop);
                });
              });
            }

            resolve(responseItems);
          },
          error => reject(error)
        );
    });
  }
}

@Injectable()
export class LectureService extends DataService {
  constructor(public backendService: BackendService) {
    super('lecture/', backendService);
  }
}

@Injectable()
export class UnitService extends DataService {
  constructor(public backendService: BackendService) {
    super('units/', backendService);
  }

  addTaskUnit(taskUnit: ITaskUnit, lectureId: string) {
    const originalApiPath = this.apiPath;
    this.apiPath += 'tasks';
    const promise = this.createItem({taskUnit: taskUnit, lectureId: lectureId});
    this.apiPath = originalApiPath;
    return promise;
  }

  addFreeTextUnit(freeTextUnit: IFreeTextUnit, lectureId: string) {
    // TODO ?!
    const originalApiPath = this.apiPath;
    this.apiPath += 'free-texts';
    const promise = this.createItem({freeTextUnit: freeTextUnit, lectureId: lectureId});
    this.apiPath = originalApiPath;
    return promise;
  }
}

@Injectable()
export class UserDataService extends DataService {
  constructor(public backendService: BackendService) {
    super('users/', backendService);
  }


  getRoles(): Promise<any[]> {
    const originalApiPath = this.apiPath;
    this.apiPath += 'roles';
    const promise = this.readItems();
    this.apiPath = originalApiPath;
    return promise;
  }
}

@Injectable()
export class AboutDataService extends DataService {
  constructor(public backendService: BackendService) {
    super('about/', backendService);
  }

  getApiDependencies(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.backendService.get(this.apiPath + 'dependencies')
        .subscribe((responseItems: any) => {
            const out = [];
            responseItems.data.forEach(item => {
              out.push(new Dependency(
                item.name,
                item.version,
                item.repository,
                item.license,
                item.devDependency)
              );
            });
            resolve(out);
          },
          error => reject(error)
        );
    });
  }
}
