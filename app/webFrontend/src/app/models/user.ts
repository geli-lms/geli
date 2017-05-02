export class User {
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
