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

  createItem(createItem: any): Promise<any> {
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
          (error) => reject(error)
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
    // TODO: If this works, apply to all
    return this.backendService.put(this.apiPath + 'directory', JSON.stringify({name: rootDirName}))
      .toPromise();
  }

  createDir(newDirName: string, parentDir: IDirectory): Promise<IDirectory> {
    return new Promise<IDirectory>((resolve, reject) => {
      this.backendService.put(this.apiPath + 'directory/' + parentDir._id, JSON.stringify({name: newDirName}))
        .subscribe((responseItem: IDirectory) => {
            resolve(responseItem);
          },
          error => reject(error)
        );
    });
  }

  addFile(directory: IDirectory): Promise<IFile> {
    return new Promise<IFile>((resolve, reject) => {
      this.backendService.put(this.apiPath + 'file/' + directory._id, JSON.stringify({}))
        .subscribe((responseItem: IFile) => {
            resolve(responseItem);
          },
          error => reject(error)
        );
    });
  }

  getDirectory(dirId: string, lazy: boolean = false): Promise<IDirectory> {
    const path = this.apiPath + 'directory/' + dirId + (lazy ? '/lazy' : '');
    return new Promise<IDirectory>((resolve, reject) => {
      this.backendService.get(path)
        .subscribe((responseItem: IDirectory) => {
            resolve(responseItem);
          },
          error => reject(error)
        );
    });
  }

  getFile(fileId: string): Promise<IFile> {
    return new Promise<IFile>((resolve, reject) => {
      this.backendService.get(this.apiPath + 'file/' + fileId)
        .subscribe((responseItem: IFile) => {
            resolve(responseItem);
          },
          error => reject(error));
    });
  }

  deleteDirectory(dir: IDirectory): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.backendService.delete(this.apiPath + 'directory/' + dir._id)
        .subscribe(
          (responseItem: any) => {
            resolve(responseItem);
          },
          error => reject(error)
        );
    });
  }

  deleteFile(file: IFile): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.backendService.delete(this.apiPath + 'file/' + file._id)
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
      this.backendService.post(this.apiPath + '/size', idl).subscribe((responseItem: any) => {
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
