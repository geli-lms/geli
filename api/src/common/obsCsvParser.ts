/**
 * Created by olineff on 05.06.2017.
 */
import {Course} from '../models/Course';
import {IUser} from '../../../shared/models/IUser';
import {ICourse} from '../../../shared/models/ICourse';

export class ObsCsvParser {
  course: ICourse;
  lines: string[] = [];
  allUsers: IUser[] = [];
  whitelistUser: { firstName: string, lastName: string, uid: string }[] = [];

  public work(file: any, course: any, user: any[]): any {
    this.splitByLineBreaks(file.buffer.toString());
    this.allUsers = user;
    this.course = course;
    console.log('File was parsed successfully. There where ' + this.whitelistUser.length + ' whitelistUser parsed.');
    this.addParsedUsersToCourse();
    return course;
  }

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

  private addParsedUsersToCourse() {
    this.whitelistUser.forEach(wUser => {
      const foundUsers: IUser[] =
        this.allUsers.filter(user =>
        wUser.firstName === user.profile.firstName
        && wUser.lastName === user.profile.lastName
        && wUser.uid === user.uid);
      foundUsers.forEach(e => this.course.students.push(e));
    });
  }

  private addWhitelistUser() {
    this.course.description
  }

}
