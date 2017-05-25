
// TODO must related connected to a lecture

export class Task {
  _id: any;
  name: string;
  courseId: string;
  answers: [
    {
      _id: any;
      value: boolean,
      text: string
    }
    ];
  constructor(courseId: string, name: string ) {
    this.name = name;
    this.courseId = courseId;
    // this._id = null;
  }
}

