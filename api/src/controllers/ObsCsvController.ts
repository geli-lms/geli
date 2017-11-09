import {IUser} from '../../../shared/models/IUser';
import {WhitelistUser} from '../models/WhitelistUser';
import {ICourseModel} from '../models/Course';
import {HttpError} from 'routing-controllers';
import e = require('express');
const fs = require('fs');
const utf8 = require('to-utf-8');
const csv = require('fast-csv');

export class ObsCsvController {
  private whitelistUser: { firstName: string, lastName: string, uid: string }[] = [];

  /**
   * Parse a CSV file from filesystem convert it to uft8 an write it in string buffer.
   * @param file Is a file uploaded by frontend.
   */
  public parseFile(file: any) {
    let buffer = '';
    return new Promise(function (resolve: any, reject: any) {
      fs.createReadStream(file.path)
        .pipe(utf8()).pipe(csv())
        .on('data', (data: any) => {
            buffer += data + '\n';
          }
        ).on('end', () => {
          fs.unlinkSync(file.path);
          console.log('File is parsed successfully.');
          resolve(buffer);
        }
      );
    });
  }

  /**
   * Update a given course from parsed string in csv format. Generate whitelist users an add all matched users to course.
   * @param buffer A string in parsed CSV format.
   * @param course The course which will be updated.
   * @param allUsers All users in System.
   * @returns {any} An updated course model.
   */
  public updateCourseFromBuffer(buffer: string, course: ICourseModel, allUsers: any[]): ICourseModel {
    this.pushWhitelistUser(buffer);
    course = this.addParsedUsersToCourse(course, allUsers);
    return this.updateWhitelistUser(course);
  }

  /**
   * Push create whitelist users from parsed string and push them to an array of whitelist users.
   * @param buffer Parsed string where users are created from.
   */
  private pushWhitelistUser(buffer: string) {
    this.whitelistUser = [];
    const lines = buffer.split(/\r?\n|\r/);
    let actualLine = 0;
    const userLines = lines.filter((line) => line.split(';').length >= 3);
    userLines.forEach((singleLine) => {
        actualLine++;
        const lastName = singleLine.split(';')[0];
        const firstName = singleLine.split(';')[1];
        const uid = singleLine.split(';')[2];
        if (firstName.length > 0 && lastName.length > 0 && uid.length > 0) {
          if (!isNaN(Number(firstName))) {
            throw new HttpError(400, 'First name was a number in line ' + actualLine + '.');
          }
          if (!isNaN(Number(lastName))) {
            throw new HttpError(400, 'Last name was a number in line ' + actualLine + '.');
          }
          if (isNaN(Number(uid))) {
            throw new HttpError(400, 'UID is not a number ' + actualLine + '.');
          }
          this.whitelistUser.push({
            firstName: firstName,
            lastName: lastName,
            uid: uid
          });
        }
      }
    );
    console.log('File was parsed successfully. There where ' + this.whitelistUser.length + ' user parsed in whitelist.');
  }

  /**
   * Add all available user which are on whitelist to course.
   * @param course Is the actual course.
   * @param allUsers Are all users in system.
   * @returns {any} Is the updated course.
   */
  private addParsedUsersToCourse(course: ICourseModel, allUsers: IUser[]): ICourseModel {
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
      if (foundUser != null && course.students.filter((student: any) =>
        student.toString() === foundUser._id.toString()).length <= 0) {
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
  private updateWhitelistUser(course: ICourseModel): ICourseModel {
    course.whitelist.forEach((wuser: any) => WhitelistUser.findByIdAndRemove(wuser)
      .then(() => {
      }));
    course.whitelist = [];
    this.whitelistUser.forEach((whiteListUser) => {
      const wUser = new WhitelistUser();
      wUser.firstName = whiteListUser.firstName;
      wUser.lastName = whiteListUser.lastName;
      wUser.uid = whiteListUser.uid;
      wUser.save().then(user => user.toObject());
      course.whitelist.push(wUser._id);
    });
    return course;
  }
}
