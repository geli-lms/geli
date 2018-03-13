import {Injectable} from '@angular/core';
import {BackendService} from './backend.service';
import {Dependency} from '../../about/licenses/dependency.model';
import {ITaskUnit} from '../../../../../../shared/models/units/ITaskUnit';
import construct = Reflect.construct;
import {ILecture} from '../../../../../../shared/models/ILecture';
import {IUnit} from '../../../../../../shared/models/units/IUnit';
import {IUser} from '../../../../../../shared/models/IUser';
import {ICourse} from '../../../../../../shared/models/ICourse';
import {INotificationSettings} from '../../../../../../shared/models/INotificationSettings';
import {IDownload} from '../../../../../../shared/models/IDownload';

export abstract class DataService {

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

  createItem<T>(createItem: T): Promise<T> {
    return this.backendService
      .post(this.apiPath, createItem)
      .toPromise();
  }

  readItems<T>(): Promise<T[]> {
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
          (error) => reject(error)
        );
    });
  }

  updateItem<T extends any>(updateItem: T): Promise<T> {
    return this.backendService
      .put(this.apiPath + updateItem._id, JSON.stringify(updateItem))
      .toPromise();
  }

  deleteItem<T extends any>(deleteItem: T): Promise<any> {
    return this.backendService
      .delete(this.apiPath + deleteItem._id)
      .toPromise();
  }

  readSingleItem<T>(id: string): Promise<T> {
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
export class ExportService extends DataService {
  constructor(public backendService: BackendService) {
    super('export/', backendService);
  }

  exportCourse(course: ICourse): Promise<ICourse> {
    return this.backendService
      .get(this.apiPath + 'course/' + course._id)
      .toPromise();
  }

  exportLecture(lecture: ILecture): Promise<ILecture> {
    return this.backendService
      .get(this.apiPath + 'lecture/' + lecture._id)
      .toPromise();
  }

  exportUnit(unit: IUnit): Promise<IUnit> {
    return this.backendService
      .get(this.apiPath + 'unit/' + unit._id)
      .toPromise();
  }
}

@Injectable()
export class ImportService extends DataService {
  constructor(public backendService: BackendService) {
    super('import/', backendService);
  }

  importCourse(course: ICourse): Promise<ICourse> {
    return this.backendService
      .post(this.apiPath + 'course/', JSON.stringify(course))
      .toPromise();
  }

  importLecture(lecture: ILecture, course: ICourse): Promise<ILecture> {
    return this.backendService
      .post(this.apiPath + 'course/' + course._id, JSON.stringify(lecture))
      .toPromise();
  }

  importUnit(unit: IUnit, lecture: ILecture, course: ICourse): Promise<IUnit> {
    return this.backendService
      .post(this.apiPath + 'unit/' + course._id + '/' + lecture._id, JSON.stringify(unit))
      .toPromise();
  }
}

@Injectable()
export class DuplicationService extends DataService {
  constructor(public backendService: BackendService) {
    super('duplicate/', backendService);
  }

  duplicateCourse(course: ICourse, courseAdmin: IUser): Promise<ICourse> {
    return this.backendService
      .post(this.apiPath + 'course/' + course._id, JSON.stringify({courseAdmin: courseAdmin}))
      .toPromise();
  }

  duplicateLecture(lecture: ILecture, courseId: string): Promise<ILecture> {
    return this.backendService
      .post(this.apiPath + 'lecture/' + lecture._id, JSON.stringify({courseId: courseId}))
      .toPromise();
  }

  duplicateUnit(unit: IUnit, lectureId: string, courseId: string): Promise<IUnit> {
    return this.backendService
      .post(this.apiPath + 'unit/' + unit._id, JSON.stringify({courseId: courseId, lectureId: lectureId}))
      .toPromise();
  }
}


@Injectable()
export class CourseService extends DataService {
  constructor(public backendService: BackendService) {
    super('courses/', backendService);
  }

  enrollStudent(courseId: string, data: any): Promise<ICourse> {
    const accessKey: string = data.accessKey;
    return this.backendService
      .post(this.apiPath + courseId + '/enroll', JSON.stringify({accessKey}))
      .toPromise();
  }

  sendMailToSelectedUsers(data: any): Promise<any> {
    return this.backendService
      .post(this.apiPath + 'mail', JSON.stringify(data))
      .toPromise();
  }

  leaveStudent(courseId: string): Promise<ICourse> {
    return this.backendService
      .post(this.apiPath + courseId + '/leave', {})
      .toPromise();
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

  getUnitForCourse(courseId: string): Promise<any> {
    const originalApiPath = this.apiPath;
    this.apiPath += 'progressable/course/';
    const promise = this.readSingleItem(courseId);
    this.apiPath = originalApiPath;
    return promise;
  }

  getProgressableUnits(courseId: string): Promise<any> {
    const originalApiPath = this.apiPath;
    this.apiPath += 'course/progressable/';
    const promise = this.readSingleItem(courseId);
    this.apiPath = originalApiPath;
    return promise;
  }
}

@Injectable()
export class CodeKataUnitService extends DataService {
  constructor(public backendService: BackendService) {
    super('units/code-katas/', backendService);
  }
}

@Injectable()
export class FreeTextUnitService extends DataService {
  constructor(public backendService: BackendService) {
    super('units/free-texts/', backendService);
  }
}

@Injectable()
export class NotificationSettingsService extends DataService {
  constructor(public backendService: BackendService) {
    super('notificationSettings/', backendService);
  }

  getNotificationSettingsPerUser(user: IUser): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.backendService.get(this.apiPath + 'user/' + user._id)
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
export class NotificationService extends DataService {
  constructor(public backendService: BackendService) {
    super('notification/', backendService);
  }

  getNotificationsPerUser(user: IUser): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.backendService.get(this.apiPath + 'user/' + user._id)
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
export class UserDataService extends DataService {
  constructor(public backendService: BackendService) {
    super('users/', backendService);
  }

  // FIXME: Which Type comes back?
  searchUsers(role: string, query: string): Promise<any> {
    const originalApiPath = this.apiPath;
    this.apiPath += 'members/search/';
    this.apiPath += '?role=' + role;
    this.apiPath += '&query=' + query;
    const promise = this.readItems();
    this.apiPath = originalApiPath;
    return promise;
  }

  getRoles(): Promise<string[]> {
    const originalApiPath = this.apiPath;
    this.apiPath += 'roles/';
    const promise = this.readItems<string>();
    this.apiPath = originalApiPath;
    return promise;
  }

  addPicture(data: any): Promise<IUser> {
    const originalApiPath = this.apiPath;
    this.apiPath += 'picture/';
    const promise = this.updateItem(data);
    this.apiPath = originalApiPath;
    return promise;
  }
}

@Injectable()
export class WhitelistUserService extends DataService {
  constructor(public backendService: BackendService) {
    super('whitelist/', backendService);
  }

  countWhitelistUsers(courseId: string): Promise<any> {
    const originalApiPath = this.apiPath;
    this.apiPath += courseId + '/';
    this.apiPath += 'count/';
    const promise = this.readItems();
    this.apiPath = originalApiPath;
    return promise;
  }
}

@Injectable()
export class APIInfoService extends DataService {

  private apiInfo: any;

  constructor(public backendService: BackendService) {
    // use root route
    super('', backendService);
  }

  async readAPIInfo() {
    if (!this.apiInfo) {
      this.apiInfo = await this.readItems();
    }
    return this.apiInfo;
  }
}

@Injectable()
export class AboutDataService extends DataService {
  constructor(public backendService: BackendService) {
    super('about/', backendService);
  }

  getApiDependencies(): Promise<Dependency[]> {
    return new Promise((resolve, reject) => {
      this.backendService.get(this.apiPath + 'dependencies')
        .subscribe((responseItems: any) => {
            if (responseItems.httpCode >= 500) {
              // FIXME: Just return, right?
              return resolve([]);
            }

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

@Injectable()
export class DownloadFileService extends DataService {
  constructor(public backendService: BackendService) {
    super('download/', backendService);
  }

  postDownloadReqForCourse(idl: IDownload): Promise<Response>{
    return this.backendService
      .post(this.apiPath, idl)
      .toPromise();
  }

  getFile(id: string): Promise<Response>{
    return this.backendService
      .getDownload(this.apiPath + id)
      .toPromise();
  }
}

@Injectable()
export class ConfigService extends DataService {
  constructor(public backendService: BackendService) {
    super('config/', backendService);
  }
}
