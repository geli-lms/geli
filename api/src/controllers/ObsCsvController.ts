import {IUser} from '../../../shared/models/IUser';
import {IWUserModel, WUser} from '../models/WUser';
import {IWUser} from '../../../shared/models/IWUser';
const fs = require('fs');
const utf8 = require('to-utf-8');
const csv = require('fast-csv');

export class ObsCsvController {
  private whitelistUser: { firstName: string, lastName: string, uid: string }[] = [];

  /**
   * Updates a course by adding all parsed whitelist users to it and enroll matched users.
   * @param file Is a file uploaded by frontend.
   * @param course Is the actual course.
   * @param allUsers Are all users in system.
   * @returns {any} Is the updated course.
   */
  public updateCourseFromFile(file: any, course: any, allUsers: IUser[]) {
    let buffer = '';
    return fs.createReadStream(file.path)
      .pipe(utf8()).pipe(csv())
      .on('data', (data: any) => {
          buffer += data + '\n';
        }
        // TODO @OliverNeff Valdiation.
      ).on('end', () => {
          fs.unlink(file.path);
          console.log('File is parsed successfully.');
          this.pushWhitelistUser(buffer);
          course = this.addParsedUsersToCourse(course, allUsers);
          course = this.updateWhitelistUser(course);
          return course;
        }
      );
  }

  /**
   * Push create whitelist users from parsed string and push them to an array of whitelist users.
   * @param buffer Parsed string where users are created from.
   */
  public pushWhitelistUser(buffer: string) {
    this.whitelistUser = [];
    const lines = buffer.split(/\r?\n|\r/);
    const userLines = lines.filter(e => e.split(';').length >= 3);
    userLines.forEach(e =>
      this.whitelistUser.push({
        firstName: e.split(';')[0],
        lastName: e.split(';')[1],
        uid: Number(e.split(';')[2]).toString()
      }));
    console.log('File was parsed successfully. There where ' + this.whitelistUser.length + ' whitelistUser parsed.');
  }

  /**
   * Add all available user which are on whitelist to course.
   * @param course Is the actual course.
   * @param allUsers Are all users in system.
   * @returns {any} Is the updated course.
   */
  public addParsedUsersToCourse(course: any, allUsers: IUser[]): any {
    this.whitelistUser.forEach(wUser => {
      let foundUser: IUser = null;
      const foundUsers: IUser[] =
        allUsers.filter(user =>
        wUser.firstName === user.profile.firstName
        && wUser.lastName === user.profile.lastName
        && wUser.uid === user.uid);
      if (foundUsers.length > 0) {
        foundUser = foundUsers[0];
      }
      if (foundUser != null && course.students.filter((e: any) =>
        e.toString() === foundUser._id.toString()).length <= 0) {
        course.students.push(foundUser);
      }
    });
    return course;
  }

  /**
   * Remove all whitelist users from course and save new pared whitelist users in database.
   * @param course Is the course to update.
   * @returns {any} Updated course.
   */
  public updateWhitelistUser(course: any): any {
    course.whitelist.forEach((wuser: any) => WUser.findByIdAndRemove(wuser.toString())
      .then(() => {
      }));
    course.whitelist = [];
    this.whitelistUser.forEach(e => {
      const wUser = new WUser();
      wUser.firstName = e.firstName;
      wUser.lastName = e.lastName;
      wUser.uid = e.uid;
      wUser.save().then(user => user.toObject());
      course.whitelist.push(wUser._id);
    });
    return course;
  }
}
