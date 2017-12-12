import * as mongoose from 'mongoose';
import config from '../src/config/main';
import {User} from '../src/models/User';
import * as fs from 'fs';
import {Course} from '../src/models/Course';
import * as crypto from 'crypto';
import {FixtureUtils} from './FixtureUtils';

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
    for (const userFile of userfixtures) {
      const file = fs.readFileSync(this.usersDirectory + userFile);
      const users = JSON.parse(file.toString());

      // each file consists of an array of users to provide possibility of logical grouping
      for (const userDef of users) {
        await new User(userDef).save();
      }
    }

    // import coursefiles
    const courseIDs = await Promise.all(coursefixtures.map(async (courseFile: string) => {
      const file = fs.readFileSync(this.coursesDirectory + courseFile);
      const course = JSON.parse(file.toString());

      const hash = crypto.createHash('sha1').update(file.toString()).digest('hex');

      // assign random courseAdmin
      const teacher = await FixtureUtils.getRandomTeacher(hash);
      // assign random courseTeachers
      course.teachers = await FixtureUtils.getRandomTeachers(0, 2, hash);
      // enroll random array of Students
      course.students = await FixtureUtils.getRandomStudents(2, 10, hash);

      const importedCourse = await Course.schema.statics.importJSON(course, teacher, course.active);
      return importedCourse._id;
    }));
  }
}
