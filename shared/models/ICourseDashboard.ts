import {IPicture} from './mediaManager/IPicture';

export {ENROLL_TYPE_WHITELIST} from './ICourse';
export {ENROLL_TYPE_FREE} from './ICourse';
export {ENROLL_TYPE_ACCESSKEY} from './ICourse';
export {ENROLL_TYPES} from './ICourse';

export interface ICourseDashboard {
  // As in ICourse:
  _id: any;
  name: string;
  active: boolean;
  description: string;
  enrollType: string;
  image: IPicture;

  // Special properties for the dashboard:
  userCanEditCourse: boolean;
  userCanViewCourse: boolean;
  userIsCourseAdmin: boolean;
  userIsCourseTeacher: boolean;
  userIsCourseMember: boolean;
}
