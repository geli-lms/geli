import {IUser} from '../../../shared/models/IUser';
import {WhitelistUser} from '../models/WhitelistUser';
import {ICourseModel} from '../models/Course';
import e = require('express');
import {isNumber} from 'util';
import {HttpError} from 'routing-controllers';
const fs = require('fs');
const utf8 = require('to-utf-8');
const csv = require('fast-csv');

export class ObsCsvController {
  private whitelistUser: { firstName: string, lastName: string, uid: string }[] = [];

  /**
   * Parse a CSV file from filesystem convert it to uft8 an write it in string buffer.
   * @param file Is a file uploaded by frontend.
   * @param course Is the actual course.
   * @param allUsers Are all users in system.
   * @returns {any} Is the updated course.
   */
  public parseFile(file: any, course: ICourseModel) {
    let buffer = '';
    return new Promise(function (resolve: any, reject: any) {
      fs.createReadStream(file.path)
        .pipe(utf8()).pipe(csv())
        .on('data', (data: any) => {
            buffer += data + '\n';
          }
          // TODO @OliverNeff Valdiation.
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
    const userLines = lines.filter(e => e.split(';').length >= 3);
    userLines.forEach(e => {
        const firstName = e.split(';')[0];
        const lastName = e.split(';')[1];
        const uid = e.split(';')[2];
        if (firstName.length > 0 && lastName.length > 0 && uid.length > 0) {
          console.log(Number(firstName));
          if (!isNaN(Number(firstName))) {
            throw new HttpError(400, 'firstName was a number.');
          }
          if (!isNaN(Number(lastName))) {
            throw new HttpError(400, 'lastName was a number.');
          }
          if (isNaN(Number(uid))) {
            throw new HttpError(400, 'UID is not a number.');
          }
          this.whitelistUser.push({
            firstName: firstName,
            lastName: lastName,
            uid: uid
          });
        }
      }
    );
    console.log('File was parsed successfully. There where ' + this.whitelistUser.length + ' whitelistUser parsed.');
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
  private updateWhitelistUser(course: ICourseModel): ICourseModel {
    course.whitelist.forEach((wuser: any) => WhitelistUser.findByIdAndRemove(wuser)
      .then(() => {
      }));
    course.whitelist = [];
    this.whitelistUser.forEach(e => {
      const wUser = new WhitelistUser();
      wUser.firstName = e.firstName;
      wUser.lastName = e.lastName;
      wUser.uid = e.uid;
      wUser.save().then(user => user.toObject());
      course.whitelist.push(wUser._id);
    });
    return course;
  }
}
