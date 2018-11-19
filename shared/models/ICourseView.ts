import {ILecture} from './ILecture';
import {IUserSubCourseView} from './IUserSubCourseView';

export interface ICourseView {
  _id: any;
  name: string;
  description: string;
  courseAdmin: IUserSubCourseView;
  teachers: IUserSubCourseView[];
  lectures: ILecture[];
  chatRooms: string[];
  freeTextStyle: string;
  userCanEditCourse: boolean;
}
