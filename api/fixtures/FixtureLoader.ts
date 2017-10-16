import * as mongoose from 'mongoose';
import config from '../src/config/main';

import {studentFixtures} from './UserFixtures/studentFixtures';
import {courseFixtures} from './courseFixtures';
import {lectureFixtures1} from './lectureFixtures/1-lectureFixtures';
import {IFixture} from './IFixture';
import {Course, ICourseModel} from '../src/models/Course';
import {ILectureModel} from '../src/models/Lecture';
import {adminFixtures} from './UserFixtures/adminFixtures';
import {teacherFixtures} from './UserFixtures/teacherFixtures';
import {tutorFixtures} from './UserFixtures/tutorFixtures';
import {lectureFixtures2} from './lectureFixtures/2-lectureFixtures';
import {freeTextFixture1u1} from './unitFixtures/1-1-freeTextFixture';
import {freeTextFixture1u2} from './unitFixtures/1-2-freeTextFixture';
import {codeKataFixture2u1} from './unitFixtures/2-1-codeKataFixtures';
import {IUnitModel} from '../src/models/units/Unit';

export class FixtureLoader {

  private user: Array<IFixture> = [
    adminFixtures,
    teacherFixtures,
    tutorFixtures,
    studentFixtures,
  ];

  private courses: Array<IFixture> = [
    courseFixtures,
  ];

  private lectures: Array<IFixture> = [
    lectureFixtures1,
    lectureFixtures2,
  ];

  private units = [
    [
      [freeTextFixture1u1],
      [freeTextFixture1u2],
    ],
    [
      [codeKataFixture2u1],
    ]
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
      // Load users to Database
      Promise.all(
        this.user.map((userFixtures) =>
          Promise.all(
            userFixtures.data.map((user) =>
              new userFixtures.Model(user).save()
            )
          )
        )
      ))
    .then(() =>
      // Load courses
      Promise.all(
        this.courses.map((courseFixtures) =>
          Promise.all(
            courseFixtures.data.map((course) =>
              new courseFixtures.Model(course).save()
            )
          )
        )
      )
    )
    .then(() => Course.find())
    .then((courses: ICourseModel[]) =>
      Promise.all(courses.map((course: ICourseModel, courseIndex: number) => {
        const courseLectures: IFixture = this.lectures[courseIndex];
        // save all lectures
        return Promise.all(courseLectures.data.map((lecture: ILectureModel, lectureIndex: number) =>  {
          const lect: ILectureModel = <ILectureModel> new courseLectures.Model(lecture);
          const lectureUnits: IFixture[] = this.units[courseIndex][lectureIndex];

          return Promise.all(lectureUnits.map((unitFixtures) =>
            // save Units
            Promise.all(unitFixtures.data.map((unit: IUnitModel) => {
              unit._course = course._id;
              return new unitFixtures.Model(unit).save();
            }))
            // push units to lecture
            .then((savedUnits: IUnitModel[]) => {
              lect.units = lect.units.concat(savedUnits);
              return savedUnits.length;
            })
          ))
          .then(() => lect.save());
        }))
        // push lectures to course
        .then((savedLectures: ILectureModel[]) => {
          course.lectures = course.lectures.concat(savedLectures);
          return course.save();
        });
      }))
    );
  }
}

/*
          const lect: ILectureModel = <ILectureModel> new courseLectures.Model(lecture);
          const lectureUnits: IFixture[] = this.units[courseIndex][lectureIndex];
          // saving Units
          return Promise.all(lectureUnits.map((unitFixtures) =>
            Promise.all(unitFixtures.data.map((unit) =>
              new unitFixtures.Model(unit).save()
            ))
            // push units to lecture
            .then((savedUnits: IUnitModel[]) => {
              lect.units = lect.units.concat(savedUnits);
            })
          ))
          .then(() => lect.save);
 */
