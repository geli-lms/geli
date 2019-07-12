import * as mongoose from 'mongoose';
import config from '../src/config/main';
import {User} from '../src/models/User';
import * as fs from 'fs';
import {Course} from '../src/models/Course';
import * as crypto from 'crypto';
import {FixtureUtils} from './FixtureUtils';
import {Lecture} from '../src/models/Lecture';
import {Unit} from '../src/models/units/Unit';
import {Message} from '../src/models/Message';
import {WhitelistUser} from '../src/models/WhitelistUser';
import {Progress} from '../src/models/progress/Progress';
import {ITaskUnitModel} from '../src/models/units/TaskUnit';
import {ICodeKataUnit} from '../../shared/models/units/ICodeKataUnit';
import {ChatRoom} from '../src/models/ChatRoom';
import {IChatRoom} from '../../shared/models/IChatRoom';
import {IUser} from '../../shared/models/IUser';


export class FixtureLoader {
  private usersDirectory = 'build/fixtures/users/';
  private coursesDirectory = 'build/fixtures/courses/';
  private chatDirectory = 'build/fixtures/chat/';
  private binaryDirectory = 'build/fixtures/binaryData/';

  async loadMessages() {
    const messageFixtures = fs.readdirSync(this.chatDirectory);
    for (const messageFile of messageFixtures) {
      const file = fs.readFileSync(this.chatDirectory + messageFile);
      let chatRooms: IChatRoom[];

      if (messageFile.toString().includes('messages')) {
        chatRooms = await ChatRoom.find({'room.roomType': 'Course'});
      } else {
        chatRooms = await ChatRoom.find({'room.roomType': 'Unit'});
      }

      const messages = JSON.parse(file.toString());
      chatRooms.map(async (chatRoom: IChatRoom) => {
        const hash = crypto.createHash('sha1').update(file.toString()).digest('hex');
        const users: IUser[] = await  FixtureUtils.getRandomUsers(2, 10, hash);

        messages.map(async (message: any) => {
          message.room = chatRoom._id;
          let randomIdx = FixtureUtils.getRandomNumber(0, users.length);
          let randomUser: IUser = users[randomIdx];
          message.author = randomUser._id;
          message.chatName = randomUser.role + randomIdx;

          if (message.comments && message.comments.length > 0) {
            message.comments.map((msg: any) => {
              msg.room = chatRoom._id;
              randomIdx = FixtureUtils.getRandomNumber(0, users.length);
              randomUser = users[randomIdx];
              msg.author = randomUser._id;
              msg.chatName = randomUser.role + randomIdx;
            });
          }

          await new Message(message).save();
        });

      });
    }
  }

  async load() {
    if (!mongoose.connection.readyState) {
      await mongoose.connect(config.database, config.databaseOptions);
    }

    await mongoose.connection.dropDatabase();
    await User.createIndexes();

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
    await Promise.all(coursefixtures.map(async (courseFile: string) => {
      const file = fs.readFileSync(this.coursesDirectory + courseFile);
      const course = JSON.parse(file.toString());

      const hash = crypto.createHash('sha1').update(file.toString()).digest('hex');

      // assign random courseAdmin
      const teacher = await FixtureUtils.getRandomTeacher(hash);
      // assign random courseTeachers
      course.teachers = await FixtureUtils.getRandomTeachers(0, 2, hash);
      // enroll random array of Students
      course.students = await FixtureUtils.getRandomStudents(2, 10, hash);
      // enroll random array of WhitelistUsers
      const randomWhitelistUser = await FixtureUtils.getRandomWhitelistUsers(course.students, course, hash);
      if (!course.hasOwnProperty('whitelist')) {
        course.whitelist = [];
      }
      await Promise.all(randomWhitelistUser.map(async (whitelistUser) => {
        course.whitelist.push(await WhitelistUser.create(whitelistUser));
      }));
      const importedCourse = await Course.schema.statics.importJSON(course, teacher, course.active);
      return importedCourse._id;
    }));

    // import messages
    await this.loadMessages();

    // import files
    const fileUnits = await Unit.find({files: {$exists: true}});

    await Promise.all(fileUnits.map(async unit => {
      const files = (<any>unit).files;

      for (const file of files) {
        if (!fs.existsSync(file.path) && fs.existsSync(this.binaryDirectory + file.alias)) {
          fs.copyFileSync(this.binaryDirectory + file.alias, file.path);
        }
      }
    }));

    // generate progress
    const progressableUnits = await Unit.find({progressable: true});

    await Promise.all(progressableUnits.map(async unit => {
      const lecture = await Lecture.findOne({units: {$in: [unit._id]}});
      const course = await Course.findOne({lectures: {$in: [lecture._id]}});
      const students = await User.find({_id: {$in: course.students}});
      const unitObj = await unit.toObject();

      for (const student of students) {
        // do not create a progress if type is zero
        // 1 -> create progress with `done: false`
        // 2 -> create progress with `done: true` (and a solution)
        const progressType = FixtureUtils.getNumberFromString(student.email + student.uid + course.name + lecture.name + unit.name, 0, 3);

        if (progressType === 0) {
          continue;
        }

        const newProgress: any = {
          course: course._id.toString(),
          unit: unit._id.toString(),
          user: student._id.toString(),
        };

        // need to be implemented for each unit type separately
        switch (unit.__t) {
          case 'code-kata': {
            if (progressType === 1) {
              (<any>newProgress).code = '// at least i tried ¯\\\\_(ツ)_/¯';
              newProgress.done = false;
            } else if (progressType === 2) {
              (<any>newProgress).code = (<ICodeKataUnit>unitObj).code;
              newProgress.done = true;
            }
            newProgress.__t = 'codeKata';
            break;
          }
          case 'task': {
            // does not work properly yet
            if (progressType === 1) {
              newProgress.answers = FixtureUtils.getAnswersFromTaskUnit(<ITaskUnitModel>unit, false);
              newProgress.done = false;
            } else if (progressType === 2) {
              newProgress.answers = FixtureUtils.getAnswersFromTaskUnit(<ITaskUnitModel>unit, true);
              newProgress.done = true;
            }
            newProgress.__t = 'task-unit-progress';
            break;
          }
        }

        await Progress.create(newProgress);
      }
      return unit.name;
    }));
  }
}
