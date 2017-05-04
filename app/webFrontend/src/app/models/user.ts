import {IUser} from "../../../../../shared/models/IUser";
export class User implements IUser {
  _id: string;
  username: string;
  email: string;
  password: string;
  profile: {
    firstName: string;
    lastName: string;
  };
  role: string;
}
