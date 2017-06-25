import {Injectable} from '@angular/core';
import {BackendService} from './backend.service';
import {Dependency} from '../../about/licenses/dependency.model';
import {ITaskUnit} from '../../../../../../shared/models/units/ITaskUnit';
import {TaskAttestation} from '../../models/TaskAttestation';
import {Task} from '../../models/Task';

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
export class TaskService extends DataService { // TODO remove
  constructor(public backendService: BackendService) {
    super('/units/tasks/', backendService); // tasks/
  }
/*
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
  }*/
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



  /*
  TODO  tests anlegen :
   + ohne exisitiert
   + bereits existiert
   */
  countOfTaskAttestationsFor(taskId: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
    this.getTaskAttestationsForTask(taskId).then(
      (taskAttestations) => {
        console.log('countOfTaskAttestationsFor: ' + taskAttestations.length);
        resolve(taskAttestations.length);
     //   for (const taskAttestation of taskAttestations) {
     //   }
      }, (error) => {
        console.log('countOfTaskAttestationsFor: error' );
        // console.log('error: ' + error);
        reject(error);
      });
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

  saveTaskAsTaskAttestation(taskId: string, userId: string, task: any, correctlyAnswered: boolean): Promise<any[]> {
    return new Promise((resolve, reject) => {

      // console.log('11' + correctlyAnswered);
      const newTaskAttestation = new TaskAttestation(taskId, userId, task, correctlyAnswered);

      // add new attestation or change existing attestation
      // is there already any attestation for this task for given user?
      this.getTaskAttestationForTaskAndUser(taskId, userId).then(
        (oldTaskAttestation) => {
          console.log('oldTaskAttestation: ' + oldTaskAttestation);
          // if (oldTaskAttestation == null) {
          // console.log('null!!!!!!!!!');

          // }
          if (oldTaskAttestation.length === 0) {
            console.log('.length == 0');
            this.createItem(newTaskAttestation).then(
              (val) => {
                resolve(val);
              }, (error2) => {
                reject(error2);
                console.log(error2);
              });
          } else {
            for (const answer of newTaskAttestation.answers) {
              delete answer._id; // TODO WORKAROUND get rid of the _id for the answers
            }
            // console.log(':::::' + JSON.stringify(oldTaskAttestation));

            newTaskAttestation._id = oldTaskAttestation[0]._id;

            console.log(':::::' + JSON.stringify(newTaskAttestation));

            this.updateItem(newTaskAttestation).then(
              (val) => {
                resolve(val);

                // console.log('yyyy!!!!!!!!!!!!!');
              }, (error2) => {
                //   console.log('xxxxx!!!!!!!!!!!!!');
                reject(error2);
                //   console.log(error2);
              });
          }
          // console.log('1!!!!!!!!!!!!!');
          // console.log(JSON.stringify(oldTaskAttestation));
          // console.log('2222!!!!!!');


        }, (error) => {
          // console.log('22' + correctlyAnswered);
          console.log('error: ' + error);
          // console.log('22'  );

          //  console.log(JSON.stringify(error));
          //  console.log('33'  );

          /*   this.createItem(newTaskAttestation).then(
           (val) => {
           resolve(val);
           }, (error2) => {
           reject(error2);
           console.log(error2);
           });*/
        });
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
    const promise = this.createItem({model: taskUnit, lectureId: lectureId});
    this.apiPath = originalApiPath;
    return promise;
  }

  updateTaskUnit(taskUnit: ITaskUnit) {
    const originalApiPath = this.apiPath;
    this.apiPath += 'tasks/';
    const promise = this.updateItem(   taskUnit  );
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
