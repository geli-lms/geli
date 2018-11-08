import {IUser} from './IUser';
import {ILecture} from './ILecture';
import {IWhitelistUser} from './IWhitelistUser';
import {IDirectory} from './mediaManager/IDirectory';
import {IPicture} from './mediaManager/IPicture';
import {IFile} from './mediaManager/IFile';
import {IChatRoom} from './IChatRoom';

export const ENROLL_TYPE_WHITELIST = 'whitelist';
export const ENROLL_TYPE_FREE = 'free';
export const ENROLL_TYPE_ACCESSKEY = 'accesskey';
export const ENROLL_TYPES = [ENROLL_TYPE_WHITELIST, ENROLL_TYPE_FREE, ENROLL_TYPE_ACCESSKEY];

export const FREETEXT_STYLE_NONE = '';
export const FREETEXT_STYLE_STYLE1 = 'theme1';
export const FREETEXT_STYLE_STYLE2 = 'theme2';
export const FREETEXT_STYLE_STYLE3 = 'theme3';
export const FREETEXT_STYLE_STYLE4 = 'theme4';

export const FREETEXT_STYLES = [FREETEXT_STYLE_NONE, FREETEXT_STYLE_STYLE1, FREETEXT_STYLE_STYLE2, FREETEXT_STYLE_STYLE3, FREETEXT_STYLE_STYLE4];

export interface ICourse {
  _id: any;
  name: string;
  active: boolean;
  description: string;
  courseAdmin: IUser;
  media: IDirectory;
  image: IPicture;
  teachers: IUser[];
  students: IUser[];
  lectures: ILecture[];
  accessKey: string;
  whitelist: IWhitelistUser[];
  enrollType: string;
  hasAccessKey: boolean;
  chatRooms: IChatRoom[];
  freeTextStyle: string;
}
