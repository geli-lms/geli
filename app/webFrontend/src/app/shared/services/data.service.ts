import {Injectable} from '@angular/core';
import {BackendService} from './backend.service';
import {Dependency} from '../../about/licenses/dependency.model';
import {ITaskUnit} from '../../../../../../shared/models/units/ITaskUnit';
import {IFreeTextUnit} from '../../../../../../shared/models/units/IFreeTextUnit';
import {TaskAttestation} from '../../models/TaskAttestation';

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

  countOfEnrolledStudentsFor(courseId: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.backendService.get(this.apiPath + courseId)
        .subscribe(
          (responseItems: any) => {
            if (this.changeProps2Date) {
              responseItems.forEach(item => {
                this.changeProps2Date.forEach(prop => {
                  DataService.changeStringProp2DateProp(item, prop);
                });
              });
            }
            resolve(responseItems.students.length);
          },
          error => reject(error)
        );
    });
  }
}

@Injectable()
export class TaskAttestationService extends DataService {
  constructor(public backendService: BackendService) {
    super('task_attestations/', backendService);
  }

  getTaskAttestationForTaskAndUser(taskId: string, userId: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.backendService.get(this.apiPath + 'task/' + taskId + '/user/' + userId)
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

  getTaskAttestationsForTask(taskId: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.backendService.get(this.apiPath + 'task/' + taskId)
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

  saveTaskAsTaskAttestation(taskId: string, userId: string, task: any, correctlyAnswered: boolean): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const newTaskAttestation = new TaskAttestation(taskId, userId, task, correctlyAnswered);

      // add new attestation or change existing attestation
      // is there already an attestation for this task for given user?
      this.getTaskAttestationForTaskAndUser(taskId, userId).then(
        (oldTaskAttestation) => {
              if (oldTaskAttestation.length === 0) {
            this.createItem(newTaskAttestation).then(
              (val) => {
                resolve(val);
              }, (error2) => {
                reject(error2);
              });
          } else {
            for (const answer of newTaskAttestation.answers) {
              delete answer._id; // WORKAROUND get rid of the _id for the answers
            }

            newTaskAttestation._id = oldTaskAttestation[0]._id;

            this.updateItem(newTaskAttestation).then(
              (val) => {
                resolve(val);
              }, (error2) => {
                reject(error2);
              });
          }

        }, (error) => {
          reject(error);
        });
    });
  }

  countOfTaskAttestationsFor(taskId: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.getTaskAttestationsForTask(taskId).then(
        (taskAttestations) => {
      resolve(taskAttestations.length);

        }, (error) => {

          reject(error);
        });
    });
  }

  countOfCorrectlyAnsweredTaskAttestationsFor(taskId: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.getTaskAttestationsForTask(taskId).then(
        (taskAttestations) => {

          let n = 0;
          for (const taskAttestation of taskAttestations) {
            if (taskAttestation.correctlyAnswered) {
              n++;
            }
          }
          resolve(n);

        }, (error) => {

          reject(error);
        });
    });
  }

  /*
   countOfEnrolledStudentsFor(taskId: string): Promise<any[]> {
   return new Promise((resolve, reject) => {
   resolve(12);
   });
   }

   // muss in courseservice realisiert werden auch api
   countOfEnrolledStudentsForCourse(courseId: string): Promise<any[]> {
   return new Promise((resolve, reject) => {
   resolve(12);
   });
   }

   countOfTaskAttestationCompletedForCourseAndUser(courseId: string, userId: string): Promise<any[]> {
   return new Promise((resolve, reject) => {
   resolve(112);
   });
   }

   countOfTaskAttestationCorrectlyCompletedForCourseAndUser(courseId: string, userId: string): Promise<any[]> {
   return new Promise((resolve, reject) => {
   resolve(122);
   });
   }

   getTasksAttestationsForCourseAndUser(courseId: string, userId: string): Promise<any[]> {
   return new Promise((resolve, reject) => {
   resolve(127);
   });
   }
   */

}

@Injectable()
export class LectureService extends DataService {
  constructor(public backendService: BackendService) {
    super('lecture/', backendService);
  }
}

@Injectable()
export class UnitService extends DataService {
  constructor(public backendService: BackendService, public taskAttestationService: TaskAttestationService) {
    super('units/', backendService);
  }

  addTaskUnit(taskUnit: ITaskUnit, lectureId: string) {
    const originalApiPath = this.apiPath;
    this.apiPath += 'tasks';
    const promise = this.createItem({model: taskUnit, lectureId: lectureId});
    this.apiPath = originalApiPath;
    return promise;
  }

  updateTaskUnit(taskUnit: ITaskUnit) {
    const originalApiPath = this.apiPath;
    this.apiPath += 'tasks/';
    const promise = this.updateItem(taskUnit);
    this.apiPath = originalApiPath;
    return promise;
  }

  countOfTaskUnitAttestationsFor(taskUnit: ITaskUnit): Promise<any[]> {
    const tasks_to_add: any = [];
    for (const task of taskUnit.tasks) {
      tasks_to_add.push(task._id.toString());
    }
    return new Promise((resolve, reject) => {
      Promise.all(tasks_to_add.map(this.taskAttestationService.countOfTaskAttestationsFor, this))
        .then(
          (values) => {

            let n = 0;
            for (const value of values) {
              n = n + +value.toString();
            }
            resolve(n);

          }, (error) => {

            reject(error);
          });
    });
  }

  /*
   countOfCorrectlyAnsweredTaskUnitAttestationsFor(taskUnit: ITaskUnit): Promise<any[]> {
   return new Promise((resolve, reject) => {
   this.getTaskAttestationsForTask(taskId).then(
   (taskAttestations) => {

   let n = 0;
   for (const taskAttestation of taskAttestations) {
   if (taskAttestation.correctlyAnswered) {
   n++;
   }
   }
   resolve(n);

   }, (error) => {
   // console.log('countOfTaskAttestationsFor: error' );
   // console.log('error: ' + error);
   reject(error);
   });
   });
   }*/
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
            if (responseItems.httpCode >= 500) {
              console.log('API: ' + responseItems.message);
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
