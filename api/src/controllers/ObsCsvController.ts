/**
 * Created by olineff on 05.06.2017.
 */
import {IUser} from '../../../shared/models/IUser';
import {IWUserModel, WUser} from '../models/WUser';
import {IWUser} from '../../../shared/models/IWUser';

export class ObsCsvController {
  lines: string[] = [];
  whitelistUser: {firstName: string, lastName: string, uid: string}[] = [];

  /**
   *
   * @param file
   * @param course
   * @param allUsers
   * @returns {any}
   */
  public updateCourseFromFile(file: any, course: any, allUsers: any[]): any {
    this.parseFileToWhitelistUser(file);
    course = this.addParsedUsersToCourse(course, allUsers);
    course = this.updateWhitelistUser(course);
    return course;
  }

  /**
   *
   * @param file
   * @returns {IWUser[]}
   */
  public parseFileToWhitelistUser(file: any): any {
    this.whitelistUser = [];
    this.splitByLineBreaks(file.buffer.toString());
    console.log('File was parsed successfully. There where ' + this.whitelistUser.length + ' whitelistUser parsed.');
  }

  /**
   *
   * @param buffer
   */
  private splitByLineBreaks(buffer: string) {
    this.lines = buffer.split(/\r?\n|\r/);
    const userLines = this.lines.filter(e => e.split(';').length >= 3);
    userLines.forEach(e =>
      this.whitelistUser.push({
        firstName: e.split(';')[0],
        lastName: e.split(';')[1],
        uid: Number(e.split(';')[2]).toString()
      }));
  }

  /**
   *
   * @param course
   * @param allUsers
   * @returns {any}
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
      if (foundUser != null && course.students.filter( (e: any) =>
        e.toString() === foundUser._id.toString()).length <= 0) {
        course.students.push(foundUser);
      }
    });
    return course;
  }

  /**
   *
   * @param course
   * @returns {any}
   */
  public updateWhitelistUser(course: any): any {
    course.whitelist.forEach( (wuser: any) => WUser.findByIdAndRemove(wuser.toString())
      .then( () => {}));
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
