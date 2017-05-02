export class Task {
  _id: any;
  name: string;
  courseId: string;

  constructor(name: string, courseId: string) {
    this.name = name;
    this.courseId = courseId;
    this._id = null;
  }
}
