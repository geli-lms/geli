import {User} from '../src/models/User';

export class FixtureUtils {
  // returns a random user with role 'admin'
  // returns always the same admin when you provide the same hash (given the fixture base did not change)
  public static async getRandomAdmin(hash?: string) {
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
  public static async getRandomAdmins(min: number, max: number, hash?: string) {
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
  public static async getRandomTeacher(hash?: string) {
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
  public static async getRandomTeachers(min: number, max: number, hash?: string) {
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
  public static async getRandomStudent(hash?: string) {
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
  public static async getRandomStudents(min: number, max: number, hash?: string) {
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

  private static async getAdmins() {
    return this.getUser('admin');
  }

  private static async getTeacher() {
    return this.getUser('teacher');
  }

  private static async getStudents() {
    return this.getUser('student');
  }

  private static async getUser(role: string) {
    if (!role) {
      return User.find();
    }
    return User.find({role:  role});
  }

  private static getRandomNumber(start: number, end: number): number {
    return Math.floor(Math.random() * end) + start;
  }

  // returns a number for a given string between the boundaries of start(inclusive) and end(exclusive)
  private static getNumberFromString(str: string, start: number, end: number): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash += char;
    }
    return start + (hash % (end - start));
  }

  private static shuffleArray (array: Array<any>) {
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
