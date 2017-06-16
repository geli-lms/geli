import * as mongoose from 'mongoose';
import config from '../src/config/main';

import {userFixtures} from './userFixtures';
import {courseFixtures} from './courseFixtures';
import {taskFixtures} from './taskFixtures';
import {IFixture} from './IFixture';
import {ICourseModel} from '../src/models/Course';
import {ILectureModel} from '../src/models/Lecture';


export class FixtureLoader {

  private fixtures: Array<IFixture> = [
    userFixtures,
    courseFixtures,
    taskFixtures
  ];

  constructor() {
    (<any>mongoose).Promise = global.Promise;

    if (!mongoose.connection.readyState) {
      mongoose.connect(config.database);
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

      });
  }
}
