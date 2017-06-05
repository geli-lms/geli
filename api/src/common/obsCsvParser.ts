/**
 * Created by olineff on 05.06.2017.
 */

export class ObsCsvParser {
  course: any;
  file: any;

  constructor(file: any, course: any) {
  this.file = file;
  this.course = course;
  this.test(file.buffer);
  }

  test(buffer: any) {
    const temp = buffer.toString();
   console.log(temp);
  }

}
