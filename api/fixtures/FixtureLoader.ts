import * as mongoose from 'mongoose';
import config from '../src/config/main';

import {studentFixtures} from './UserFixtures/studentFixtures';
import {courseFixtures} from './courseFixtures';
import {dumpTestLectureFixtures} from './lectureFixtures/1-dumpTest-lectureFixtures';
import {IFixture} from './IFixture';
import {ICourseModel} from '../src/models/Course';
import {ILectureModel} from '../src/models/Lecture';
import {adminFixtures} from './UserFixtures/adminFixtures';
import {teacherFixtures} from './UserFixtures/teacherFixtures';
import {tutorFixtures} from './UserFixtures/tutorFixtures';
import {webDevelopmentLectureFixtures} from './lectureFixtures/2-intWebDev-lectureFixtures';
import {dummyFreeTextFixture} from './unitFixtures/dummyFreeTextFixture';
import {randomFreeTextFixture} from './unitFixtures/randomFreeTextFixture';
import {simpleCodeKataFixture} from './unitFixtures/simpleCodeKataFixtures';
import {IUnitModel} from '../src/models/units/Unit';
import {advancedWebDevelopmentLectureFixtures} from './lectureFixtures/3-advWebDev-lectureFixtures';
import {computerGraphicsLectureFixtures} from './lectureFixtures/4-comGra-lectureFixtures';
import {randomLectureFixtures} from './lectureFixtures/5-randomness-lectureFixtures';
import {mpseLectureFixtures} from './lectureFixtures/6-MPSE-lectureFixtures';
import {IUserModel, User} from '../src/models/User';
import {isNullOrUndefined} from 'util';
import {loremFreeTextFixture} from './unitFixtures/loremFreeTextFixture';
import {readmeFreeTextFixture} from './unitFixtures/readmeFreeTextFixture';
import {mpseIntFreeTextFixture} from './unitFixtures/mpseIntFreeTextFixture';
import {studentFreeTextFixture} from './unitFixtures/studentFreeTextFixture';
import {hardCodeKataFixture} from './unitFixtures/hardCodeKataFixtures';
import {studentCodeKataFixture} from './unitFixtures/studentCodeKataFixtures';

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
    dumpTestLectureFixtures,
    webDevelopmentLectureFixtures,
    advancedWebDevelopmentLectureFixtures,
    computerGraphicsLectureFixtures,
    randomLectureFixtures,
    mpseLectureFixtures,
  ];

  private units = [
    [ // dumpTestLectureFixtures
      [loremFreeTextFixture],
      [dummyFreeTextFixture, randomFreeTextFixture],
      [dummyFreeTextFixture],
    ],
    [ // webDevelopmentLectureFixtures
      [randomFreeTextFixture],
      [simpleCodeKataFixture],
      [dummyFreeTextFixture],
    ],
    [ // advancedWebDevelopmentLectureFixtures
      [loremFreeTextFixture],
      [hardCodeKataFixture],
      [randomFreeTextFixture],
    ],
    [ // computerGraphicsLectureFixtures
      [loremFreeTextFixture],
      [dummyFreeTextFixture],
      [randomFreeTextFixture],
      [dummyFreeTextFixture],
    ],
    [ // randomLectureFixtures
      [randomFreeTextFixture],
      [randomFreeTextFixture],
      [loremFreeTextFixture],
      [randomFreeTextFixture],
    ],
    [ // mpseLectureFixtures
      [mpseIntFreeTextFixture],
      [readmeFreeTextFixture],
      [studentFreeTextFixture, studentCodeKataFixture],
    ],
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
            courseFixtures.data.map((course) => {
              // add random teacher as course admin
              // add 2-10 random students
              const tmp = <ICourseModel>course;
              return Promise.all([this.getRandomTeacher(), this.getRandomStudents(2, 10)])
                .then((results) => {
                  // does this make any difference? do we need both? is one deprecated?
                  tmp.courseAdmin = results[0];
                  tmp.teachers = tmp.teachers.concat(results[0]);
                  tmp.students = tmp.students.concat(results[1]);
                  return tmp;
                })
                .then(() => new courseFixtures.Model(tmp).save());
            })
          )
        )
      )
    )
    .then((neastedCourseList) => {
      // unwind neasted list
      const courses: ICourseModel[] = [];
      neastedCourseList.map((courseList) =>
        courseList.map((course) =>
          courses.push(<ICourseModel>course))
      );
      return courses;
    })
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

  getRandomTeacher() {
    return this.getTeacher()
      .then((teacher: IUserModel[]) => {
        return teacher[this.getRandomNumber(0, teacher.length)];
      });
  }

  getRandomStudent() {
    return this.getStudents()
      .then((students: IUserModel[]) => {
        return students[this.getRandomNumber(0, students.length)];
      });
  }

  getRandomStudents(min: number, max: number) {
    return this.getStudents()
      .then((students: IUserModel[]) => {
        const shuffeledStudents = this.shuffleArray(students);
        const count = this.getRandomNumber(min, max);
        const start = this.getRandomNumber(0, shuffeledStudents.length - count);
        return shuffeledStudents.slice(start, start + count);
      });
  }

  getTeacher() {
    return this.getUser('teacher');
  }

  getStudents() {
    return this.getUser('student');
  }

  getUser(role: string) {
    if (isNullOrUndefined(role)) {
      return User.find();
    }
    return User.find({role:  role});
  }

  getRandomNumber(start: number, end: number): number {
    return Math.floor(Math.random() * end) + start;
  }

  shuffleArray (array: Array<any>) {
    let tmp;
    let current;
    let top = array.length;

    if (top) {
      while (--top) {
        current = Math.floor(Math.random() * (top + 1));
        tmp = array[current];
        array[current] = array[top];
        array[top] = tmp;
      }
    }

    return array;
  }
}
