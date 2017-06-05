/**
 * Created by olineff on 05.06.2017.
 */
import {Course} from '../models/Course';

export class ObsCsvParser {
  course: any;
  lines: string[] = [];
  allUsers: any[] = [];
  user: {firstName: string, lastName: string, uid: string}[] = [];


  public work(file: any, course: any, user: any[]): any {
    this.splitByLineBreaks(file.buffer.toString());
    return null;
  }

  private splitByLineBreaks(buffer: string) {
    this.lines = buffer.split(/\r?\n|\r/);
    const userLines = this.lines.filter(e => e.split(';').length >= 3);
    userLines.forEach(e => this.user.push({firstName: e.split(';')[0], lastName: e.split(';')[1], uid: e.split(';')[2]}));
    console.log(this.allUsers);
  }

}
