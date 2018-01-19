import {Injectable} from '@angular/core';
import {BackendService} from './backend.service';
import {Dependency} from '../../about/licenses/dependency.model';
import {ILecture} from '../../../../../../shared/models/ILecture';
import {IUnit} from '../../../../../../shared/models/units/IUnit';
import {IUser} from '../../../../../../shared/models/IUser';
import {ICourse} from '../../../../../../shared/models/ICourse';
import {IDownload} from '../../../../../../shared/models/IDownload';
import {IDirectory} from '../../../../../../shared/models/mediaManager/IDirectory';
import {IFile} from '../../../../../../shared/models/mediaManager/IFile';

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
    return new Promise((resolve, reject) => {
      this.backendService.post(this.apiPath, createItem)
        .subscribe(
          (responseItem) => {
            resolve(responseItem);
          },
          error => reject(error)
        );
    });
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

  deleteItem<T extends any>(deleteItem: T): Promise<any> {
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

  exportCourse(course: ICourse): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.backendService.get(this.apiPath + 'course/' + course._id)
        .subscribe(
          (responseItem: any) => {
            resolve(responseItem);
          },
          error => reject(error)
        );
    });
  }

  exportLecture(lecture: ILecture): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.backendService.get(this.apiPath + 'lecture/' + lecture._id)
        .subscribe(
          (responseItem: any) => {
            resolve(responseItem);
          },
          error => reject(error)
        );
    });
  }

  exportUnit(unit: IUnit): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.backendService.get(this.apiPath + 'unit/' + unit._id)
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
export class ImportService extends DataService {
  constructor(public backendService: BackendService) {
    super('import/', backendService);
  }

  importCourse(course: ICourse): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.backendService.post(this.apiPath + 'course/', JSON.stringify(course))
        .subscribe(
          (responseItem: any) => {
            resolve(responseItem);
          },
          error => reject(error)
        );
    });
  }

  importLecture(lecture: ILecture, course: ICourse): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.backendService.post(this.apiPath + 'course/' + course._id, JSON.stringify(lecture))
        .subscribe(
          (responseItem: any) => {
            resolve(responseItem);
          },
          error => reject(error)
        );
    });
  }

  importUnit(unit: IUnit, lecture: ILecture, course: ICourse): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.backendService.post(this.apiPath + 'unit/' + course._id + '/' + lecture._id, JSON.stringify(unit))
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
export class DuplicationService extends DataService {
  constructor(public backendService: BackendService) {
    super('duplicate/', backendService);
  }

  duplicateCourse(course: ICourse, courseAdmin: IUser): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.backendService.post(this.apiPath + 'course/' + course._id, JSON.stringify({courseAdmin: courseAdmin}))
        .subscribe(
          (responseItem: any) => {
            resolve(responseItem);
          },
          error => reject(error)
        );
    });
  }

  duplicateLecture(lecture: ILecture, courseId: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.backendService.post(this.apiPath + 'lecture/' + lecture._id, JSON.stringify({courseId: courseId}))
        .subscribe(
          (responseItem: any) => {
            resolve(responseItem);
          },
          error => reject(error)
        );
    });
  }

  duplicateUnit(unit: IUnit, lectureId: string, courseId: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.backendService.post(this.apiPath + 'unit/' + unit._id, JSON.stringify({courseId: courseId, lectureId: lectureId}))
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
export class MediaService extends DataService {
  constructor(public backendService: BackendService) {
    super('media/', backendService);
  }

  createRootDir(rootDirName: string): Promise<IDirectory> {
    return this.backendService.post(this.apiPath + 'directory', JSON.stringify({name: rootDirName}))
      .toPromise();
  }

  createDirectory(newDirName: string, parentDir: IDirectory): Promise<IDirectory> {
    return this.backendService.post(this.apiPath + 'directory/' + parentDir._id, JSON.stringify({name: newDirName}))
      .toPromise();
  }

  addFile(directory: IDirectory): Promise<IFile> {
    return this.backendService.post(this.apiPath + 'file/' + directory._id, JSON.stringify({}))
      .toPromise();
  }

  getDirectory(dirId: string, lazy: boolean = false): Promise<IDirectory> {
    const path = this.apiPath + 'directory/' + dirId + (lazy ? '/lazy' : '');
    return this.backendService.get(path)
      .toPromise();
  }

  getFile(fileId: string): Promise<IFile> {
    return this.backendService.get(this.apiPath + 'file/' + fileId)
      .toPromise();
  }

  updateDirectory(dir: IDirectory): Promise<IDirectory> {
    return this.backendService.put(this.apiPath + 'directory/' + dir._id, JSON.stringify(dir))
      .toPromise();
  }

  updateFile(file: IFile): Promise<IFile> {
    return this.backendService.put(this.apiPath + 'file/' + file._id, JSON.stringify(file))
      .toPromise();
  }

  deleteDirectory(dir: IDirectory): Promise<any> {
    return this.backendService.delete(this.apiPath + 'directory/' + dir._id)
      .toPromise();
  }

  deleteFile(file: IFile): Promise<any> {
    return this.backendService.delete(this.apiPath + 'file/' + file._id)
      .toPromise();
  }
}

@Injectable()
export class CourseService extends DataService {
  constructor(public backendService: BackendService) {
    super('courses/', backendService);
  }

  enrollStudent(courseId: string, data: any): Promise<any[]> {
    const accessKey: string = data.accessKey;
    return new Promise((resolve, reject) => {
      this.backendService.post(this.apiPath + courseId + '/enroll', JSON.stringify({accessKey}))
        .subscribe(
          (responseItem: any) => {
            resolve(responseItem);
          },
          error => reject(error)
        );
    });
  }

  sendMailToSelectedUsers(data: any): Promise<any> {
    return this.backendService
      .post(this.apiPath + 'mail', JSON.stringify(data))
      .toPromise();
  }

  leaveStudent(courseId: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.backendService.post(this.apiPath + courseId + '/leave', {})
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

  getUnitForCourse(courseId: string) {
    const originalApiPath = this.apiPath;
    this.apiPath += 'progressable/course/';
    const promise = this.readSingleItem(courseId);
    this.apiPath = originalApiPath;
    return promise;
  }

  getProgressableUnits(courseId: string) {
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
export class UserDataService extends DataService {
  constructor(public backendService: BackendService) {
    super('users/', backendService);
  }

  searchUsers(role: string, query: string): Promise<any> {
    const originalApiPath = this.apiPath;
    this.apiPath += 'members/search/';
    this.apiPath += '?role=' + role;
    this.apiPath += '&query=' + query;
    const promise = this.readItems();
    this.apiPath = originalApiPath;
    return promise;
  }

  getRoles(): Promise<any[]> {
    const originalApiPath = this.apiPath;
    this.apiPath += 'roles/';
    const promise = this.readItems();
    this.apiPath = originalApiPath;
    return promise;
  }

  addPicture(data: any): Promise<any[]> {
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
  constructor(public backendService: BackendService) {
    // use root route
    super('', backendService);
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

  getPackageSize(idl: IDownload) {
    return new Promise((resolve, reject) => {
      this.backendService.post(this.apiPath + 'size', idl).subscribe((responseItem: any) => {
          resolve(responseItem);
        },
        error => reject(error));
    });
  }

  postDownloadReqForCourse(idl: IDownload) {
    return new Promise((resolve, reject) => {
      this.backendService.post(this.apiPath, idl).subscribe((responseItem: any) => {
          resolve(responseItem);
        },
        error => reject(error));
    });
  }

  getFile(id: string) {
    return new Promise((resolve, reject) => {
      this.backendService.getDownload(this.apiPath + id).subscribe(resp => {
          resolve(resp);
        },
        error => reject(error));
    });
  }
}

@Injectable()
export class ConfigService extends DataService {
  constructor(public backendService: BackendService) {
    super('config/', backendService);
  }
}
