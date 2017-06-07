/**
 * Created by olineff on 05.06.2017.
 */
import {Course} from '../models/Course';
import {IUser} from '../../../shared/models/IUser';

export class ObsCsvParser {
  course: any;
  lines: string[] = [];
  user: {firstName: string, lastName: string, uid: string}[] = [];

  public work(file: any, course: any, user: any[]): any {
    // TODO Validierung
    this.splitByLineBreaks(file.buffer.toString());
    console.log('File was parsed successfully. There where' + this.user.length +  'user parsed.');
    return course;
  }

  private splitByLineBreaks(buffer: string) {
    this.lines = buffer.split(/\r?\n|\r/);
    const userLines = this.lines.filter(e => e.split(';').length >= 3);
    userLines.forEach(e => this.user.push({firstName: e.split(';')[0], lastName: e.split(';')[1], uid: e.split(';')[2]}));
  }

  private addParsedUsersToCourse() {

  }

}
