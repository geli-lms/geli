import {ILecture} from './ILecture';

export interface ICourseView {
  _id: any;
  name: string;
  description: string;
  lectures: ILecture[];
}
