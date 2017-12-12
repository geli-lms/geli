import * as mongoose from 'mongoose';
import config from '../src/config/main';
import {IUserModel, User} from '../src/models/User';
import {isNullOrUndefined} from 'util';
import * as fs from 'fs';
import {Course} from '../src/models/Course';
import {IUser} from '../../shared/models/IUser';
import * as crypto from 'crypto';

export class FixtureLoader {
  private usersDirectory = 'build/fixtures/users/';
  private coursesDirectory = 'build/fixtures/courses/';

  constructor() {
    (<any>mongoose).Promise = global.Promise;

    if (!mongoose.connection.readyState) {
      mongoose.connect(config.database, {useMongoClient: true});
    }
  }

  async load() {
    await mongoose.connection.dropDatabase();
    const userfixtures = fs.readdirSync(this.usersDirectory);
    const coursefixtures = fs.readdirSync(this.coursesDirectory);

    // import userfiles
    // order needs to be always the same for 'getRandom...(hash)' to work properly
    userfixtures.forEach((userFile: string) => {
      const file = fs.readFileSync(this.usersDirectory + userFile);
      const users = JSON.parse(file.toString());

      // each file consists of an array of users to provide possibility of logical grouping
      users.forEach(async (userDef: IUser) => {
        await new User(userDef).save();
      });
    });

    // import coursefiles
    const courseIDs = await Promise.all(coursefixtures.map( async (courseFile: string) => {
      const file = fs.readFileSync(this.coursesDirectory + courseFile);
      const course = JSON.parse(file.toString());

      const hash = crypto.createHash('sha1').update(file.toString()).digest('hex');

      // assign random courseAdmin
      const teacher = await this.getRandomTeacher(hash);
      // assign random courseTeachers
      course.teachers = await this.getRandomTeachers(0, 2, hash);
      // enroll random array of Students
      course.students = await this.getRandomStudents(2, 10, hash);

      const importedCourse = await Course.schema.statics.importJSON(course, teacher, course.active);
      return importedCourse._id;
    }));
  }

  // returns a random user with role 'admin'
  // returns always the same admin when you provide the same hash (given the fixture base did not change)
  async getRandomAdmin(hash?: string) {
    if (hash) {
      const admins = await this.getAdmins();
      return admins[this.getNumberFromString(hash, 0, admins.length)];
    } else {
      const admins = await this.getAdmins();
      return admins[this.getRandomNumber(0, admins.length)];
    }
  }

  // returns an array of random user with role 'admin'
  // returns always the same array when you provide the same hash (given the fixture base did not change)
  async getRandomAdmins(min: number, max: number, hash?: string) {
    if (hash) {
      const admins = await this.getAdmins();
      const count = this.getNumberFromString(hash, min, max);
      const start = this.getNumberFromString(hash, 0, admins.length - count);
      return admins.slice(start, start + count);
    } else {
      const admins = await this.getAdmins();
      const shuffeledAdmins = this.shuffleArray(admins);
      const count = this.getRandomNumber(min, max);
      const start = this.getRandomNumber(0, shuffeledAdmins.length - count);
      return shuffeledAdmins.slice(start, start + count);
    }
  }

  // returns a random user with role 'teacher'
  // returns always the same teacher when you provide the same hash (given the fixture base did not change)
  async getRandomTeacher(hash?: string) {
    if (hash) {
      const teacher = await this.getTeacher();
      return teacher[this.getNumberFromString(hash, 0, teacher.length)];
    } else {
      const teacher = await this.getTeacher();
      return teacher[this.getRandomNumber(0, teacher.length)];
    }
  }

  // returns an array of random user with role 'teacher'
  // returns always the same array when you provide the same hash (given the fixture base did not change)
  async getRandomTeachers(min: number, max: number, hash?: string) {
    if (hash) {
      const teacher = await this.getTeacher();
      const count = this.getNumberFromString(hash, min, max);
      const start = this.getNumberFromString(hash, 0, teacher.length - count);
      return teacher.slice(start, start + count);
    } else {
      const teacher = await this.getTeacher();
      const shuffeledTeacher = this.shuffleArray(teacher);
      const count = this.getRandomNumber(min, max);
      const start = this.getRandomNumber(0, shuffeledTeacher.length - count);
      return shuffeledTeacher.slice(start, start + count);
    }
  }

  // returns a random user with role 'student'
  // returns always the same student when you provide the same hash (given the fixture base did not change)
  async getRandomStudent(hash?: string) {
    if (hash) {
      const students = await this.getStudents();
      return students[this.getNumberFromString(hash, 0, students.length)];
    } else {
      const students = await this.getStudents();
      return students[this.getRandomNumber(0, students.length)];
    }
  }

  // returns an array of random user with role 'student'
  // returns always the same array when you provide the same hash (given the fixture base did not change)
  async getRandomStudents(min: number, max: number, hash?: string) {
    if (hash) {
      const students = await this.getStudents();
      const count = this.getNumberFromString(hash, min, max);
      const start = this.getNumberFromString(hash, 0, students.length - count);
      return students.slice(start, start + count);
    } else {
      const students = await this.getStudents();
      const shuffeledStudents = this.shuffleArray(students);
      const count = this.getRandomNumber(min, max);
      const start = this.getRandomNumber(0, shuffeledStudents.length - count);
      return shuffeledStudents.slice(start, start + count)
    }
  }

  async getAdmins() {
    return this.getUser('admin');
  }

  async getTeacher() {
    return this.getUser('teacher');
  }

  async getStudents() {
    return this.getUser('student');
  }

  async getUser(role: string) {
    if (isNullOrUndefined(role)) {
      return User.find();
    }
    return User.find({role:  role});
  }

  getRandomNumber(start: number, end: number): number {
    return Math.floor(Math.random() * end) + start;
  }

  // returns a number for a given string between the boundaries of start(inclusive) and end(exclusive)
  getNumberFromString(str: string, start: number, end: number): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash += char;
    }
    return start + (hash % (end - start));
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
