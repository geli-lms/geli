import * as mongoose from 'mongoose';
import config from '../src/config/main';

import {userFixtures} from './userFixtures';
import {courseFixtures} from './courseFixtures';
import {lectureFixtures} from './lectureFixtures';
import {IFixture} from './IFixture';
import {ICourseModel} from '../src/models/Course';
import {ILectureModel} from '../src/models/Lecture';
import {unitFixtures} from './unitFixtures';
import {IUnitModel} from '../src/models/units/Unit';
import {progressFixtures} from './progressFixtures';
import {IProgressModel} from '../src/models/Progress';
import {ITaskUnitModel} from '../src/models/units/TaskUnit';
import {IUserModel} from '../src/models/User';

export class FixtureLoader {

  private fixtures: Array<IFixture> = [
    userFixtures,
    courseFixtures
  ];

  constructor() {
    (<any>mongoose).Promise = global.Promise;

    if (!mongoose.connection.readyState) {
      mongoose.connect(config.database, {useMongoClient: true});
    }
  }

  load() {
    return mongoose.connection.dropDatabase()
    .then(() =>
      Promise.all(
        this.fixtures.map((modelFixtures) =>
          Promise.all(
            modelFixtures.data.map((element) =>
              new modelFixtures.Model(element).save()
            )
          )
        )
      ))
    .then(() => {
      return Promise.all(
        lectureFixtures.data.map((element) => {
          return new lectureFixtures.Model(element)
          .save()
          .then((lecture) => {
            return courseFixtures.Model.findOne({name: 'Introduction to web development'})
            .then((course) => ({course, lecture}));
          })
          .then(({course, lecture}) => {
            (<ICourseModel>course).lectures.push((<ILectureModel>lecture));
            return course.save();
          });
        })
      );
    })
    .then((course: ICourseModel[]) => {
      return Promise.all(
        unitFixtures.data.map((unitElement) => {
          unitElement._course = course[0]._id;
          return new unitFixtures.Model(unitElement)
          .save();
        })
      )
      .then((units: IUnitModel[]) => {
        return lectureFixtures.Model.findOne({name: 'Lecture 1'})
        .then((lecture) => ({lecture, units}));
      })
      .then(({lecture, units}) => {
        const lectureModel = <ILectureModel>lecture;
        units.map((unit: ITaskUnitModel) => {
          lectureModel.units.push(unit);
        });
        lectureModel.save();
        return units;
      });
    })
    .then((units: IUnitModel[]) => {
      // Creating progress fixtures
      return courseFixtures.Model.findOne({name: 'Introduction to web development'})
        .then((course) => {
          return userFixtures.Model.find({role: 'student'})
            .then((users) => ({course, users}));
        })
        .then(({course, users}) => {
          const progressModels: IProgressModel[] = [];
          for (let i = 0; i < users.length; i++) {
            (<ICourseModel>course).students.push((<IUserModel[]>users)[i]);

            for (let j = 0; j < units.length; j++) {
              progressFixtures.data.map((progress) => {
                const progressModel: IProgressModel = <IProgressModel>new progressFixtures.Model(progress);
                progressModel.course = course;
                progressModel.user = users[i];
                progressModel.unit = units[j];
                progressModels[(i * users.length) + j] = progressModel;
              });
            }
          }

          return course.save()
            .then(() => progressModels);
        })
        .then((progressModels) => {
          return Promise.all(
            progressModels.map((progressModel) => {
              return progressModel.save();
            })
          );
        });
    });
  }
}
