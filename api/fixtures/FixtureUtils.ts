import {User} from '../src/models/User';
import {Course, ICourseModel} from '../src/models/Course';
import {Lecture} from '../src/models/Lecture';
import {Unit} from '../src/models/units/Unit';
import {ICourse} from '../../shared/models/ICourse';
import {ILecture} from '../../shared/models/ILecture';
import {IUnit} from '../../shared/models/units/IUnit';
import {IUser} from '../../shared/models/IUser';
import {IWhitelistUser} from '../../shared/models/IWhitelistUser';
import {ITaskUnit} from '../../shared/models/units/ITaskUnit';
import {ITaskUnitModel} from '../src/models/units/TaskUnit';
import * as mongoose from 'mongoose';
import ObjectId = mongoose.Types.ObjectId;

export class FixtureUtils {
  public static async getRandomUser(hash?: string): Promise<IUser> {
    const array = await this.getUser();
    return this.getRandom<IUser>(array, hash);
  }

  public static async getRandomUsers(min: number, max: number, hash?: string): Promise<IUser[]> {
    const array = await this.getUser();
    return this.getRandomArray<IUser>(array, min, max, hash);
  }

  public static async getRandomAdmin(hash?: string): Promise<IUser> {
    const array = await this.getAdmins();
    return this.getRandom<IUser>(array, hash);
  }

  public static async getRandomAdmins(min: number, max: number, hash?: string): Promise<IUser[]> {
    const array = await this.getAdmins();
    return this.getRandomArray<IUser>(array, min, max, hash);
  }

  public static async getRandomTeacher(hash?: string): Promise<IUser> {
    const array = await this.getTeacher();
    return this.getRandom<IUser>(array, hash);
  }

  public static async getRandomTeacherForCourse(course: ICourse, hash?: string): Promise<IUser> {
    let array: IUser[] = [];
    array = array.concat(course.teachers);
    array.push(course.courseAdmin);
    const user = await this.getRandom<IUser>(array, hash);
    return User.findById(user);
  }

  public static async getRandomTeachers(min: number, max: number, hash?: string): Promise<IUser[]> {
    const array = await this.getTeacher();
    return this.getRandomArray<IUser>(array, min, max, hash);
  }

  public static async getRandomStudent(hash?: string): Promise<IUser> {
    const array = await this.getStudents();
    return this.getRandom<IUser>(array, hash);
  }

  public static async getRandomActiveStudent(hash?: string): Promise<IUser> {
    const array = await User.find({role:  'student', isActive: true});
    return this.getRandom<IUser>(array, hash);
  }


  public static async getRandomInactiveStudent(hash?: string): Promise<IUser> {
    const array = await User.find({role:  'student', isActive: false});
    return this.getRandom<IUser>(array, hash);
  }

  public static async getRandomStudents(min: number, max: number, hash?: string): Promise<IUser[]> {
    const array = await this.getStudents();
    return this.getRandomArray<IUser>(array, min, max, hash);
  }

  // FIXME: This should return a valid type. (Promise<IWhitelistUser[]>)
  public static async getRandomWhitelistUsers(students: IUser[], course: ICourseModel, hash?: string) {
    const randomArray = students.splice(0, this.getRandomNumber(0, students.length - 1));
    const array = await this.getRandomArray(randomArray, 0, students.length - 1, hash);
    return array.map( (stud: IUser) => {
      return {
        firstName: stud.profile.firstName,
        lastName: stud.profile.lastName,
        uid: stud.uid,
        courseId: new ObjectId(course._id)
      };
    });
  }

  public static async getRandomCourse(hash?: string): Promise<ICourse> {
    const array = await this.getCourses();
    return this.getRandom<ICourse>(array, hash);
  }

  public static async getRandomCourseWithAllUnitTypes(hash?: string): Promise<ICourse> {
    const array = await this.getCourses();
    const coursesWithAllUnitTypes: any[] = [];
    for (const course of array) {
      let hasFreeText = false;
      let hasTask = false;
      let hasCodeKata = false;
        for (const lecId of course.lectures ) {
          const lec = await Lecture.findById(lecId);
          for (const unitId of lec.units ) {
            const unit = await Unit.findById(unitId);
            if ( unit.__t === 'free-text' ) {
              hasFreeText = true;
            } else if ( unit.__t === 'task' ) {
              hasTask = true;
            } else if ( unit.__t === 'code-kata' ) {
              hasCodeKata = true;
            }
          }
        }
        if ( hasFreeText && hasTask && hasCodeKata ) {
          coursesWithAllUnitTypes.push(course);
        }
    }
    return this.getRandom<ICourse>(coursesWithAllUnitTypes, hash);
  }

  public static async getCoursesFromLecture(lecture: ILecture): Promise<ICourse> {
    return Course.findOne({lectures: { $in: [ lecture._id ] }});
  }

  public static async getCoursesFromUnit(unit: IUnit): Promise<ICourse> {
    return Course.findById(unit._course);
  }

  public static async getRandomLecture(hash?: string): Promise<ILecture> {
    const array = await this.getLectures();
    return this.getRandom<ILecture>(array, hash);
  }

  public static async getRandomLectureFromCourse(course: ICourse, hash?: string): Promise<ILecture> {
    const lectureId = await this.getRandom<ILecture>(course.lectures, hash);
    return Lecture.findById(lectureId);
  }

  public static async getLectureFromUnit(unit: IUnit): Promise<ILecture> {
    return Lecture.findOne({units: { $in: [ unit._id ] }});
  }

  public static async getRandomUnit(hash?: string): Promise<IUnit> {
    const array = await this.getUnits();
    return this.getRandom<IUnit>(array, hash);
  }

  public static async getRandomUnitFromLecture(lecture: ILecture, hash?: string): Promise<IUnit> {
    const unitId = await this.getRandom<IUnit>(lecture.units, hash);
    return Unit.findById(unitId);
  }

  public static async getRandomUnitFromCourse(course: ICourse, hash?: string): Promise<IUnit> {
    let units: Array<IUnit> = [];
    for (const lecture of course.lectures) {
      units = units.concat(lecture.units);
    }
    const unitId = await this.getRandom<IUnit>(units, hash);
    return Unit.findById(unitId);
  }

  private static async getAdmins(): Promise<IUser[]> {
    return this.getUser('admin');
  }

  private static async getTeacher(): Promise<IUser[]> {
    return this.getUser('teacher');
  }

  private static async getStudents(): Promise<IUser[]> {
    return this.getUser('student');
  }

  public static async getUserCount(): Promise<number> {
    return User.countDocuments({});
  }

  public static async getCourses(): Promise<ICourse[]> {
    return Course.find()
      .populate('students')
      .populate('whitelist');
  }

  public static async getLectures(): Promise<ILecture[]> {
    return Lecture.find();
  }

  public static async getUnits(): Promise<IUnit[]> {
    return Unit.find();
  }

  private static async getUser(role?: string): Promise<IUser[]> {
    if (!role) {
      return User.find();
    }
    return User.find({role:  role});
  }

  // returns a random entry out of the array
  // returns always the same entry when you provide the same hash (given the fixture base did not change)
  private static async getRandom<T>(array: T[], hash?: string): Promise<T> {
    if (hash) {
      return array[this.getNumberFromString(hash, 0, array.length)];
    } else {
      return array[this.getRandomNumber(0, array.length)];
    }
  }

  // returns an random subarray
  // returns always the same array when you provide the same hash (given the fixture base did not change)
  private static async getRandomArray<T>(array: T[], min: number, max: number, hash?: string): Promise<T[]> {
    if (hash) {
      const count = this.getNumberFromString(hash, min, max);
      const start = this.getNumberFromString(hash, 0, array.length - count);
      return array.slice(start, start + count);
    } else {
      const shuffeledArray = this.shuffleArray(array);
      const count = this.getRandomNumber(min, max);
      const start = this.getRandomNumber(0, shuffeledArray.length - count);
      return shuffeledArray.slice(start, start + count);
    }
  }

  public static getRandomNumber(start: number, end: number): number {
    return Math.floor(Math.random() * end) + start;
  }

  // returns a number for a given string between the boundaries of start(inclusive) and end(exclusive)
  public static getNumberFromString(str: string, start: number, end: number): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash += char;
    }
    return start + (hash % (end - start));
  }

  private static shuffleArray<T>(array: Array<T>): T[] {
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

  public static getAnswersFromTaskUnit(unit: ITaskUnitModel, success: boolean): any {
    const answers: any = {};
    const unitObj: ITaskUnit = <ITaskUnit>unit.toObject();
    unitObj.tasks.forEach((task) => {
      answers[task._id.toString()] = {};
      task.answers.forEach((answer) => {
        if (success) {
          if (answer.hasOwnProperty('value')) {
            answers[task._id.toString()][answer._id.toString()] = true;
          } else {
            answers[task._id.toString()][answer._id.toString()] = false;
          }
        } else {
          if (answer.hasOwnProperty('value')) {
            answers[task._id.toString()][answer._id.toString()] = false;
          } else {
            answers[task._id.toString()][answer._id.toString()] = true;
          }
        }
      });
    });

    return answers;
  }
}
