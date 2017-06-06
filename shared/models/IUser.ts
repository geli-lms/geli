export interface IUser {
    _id: any;
    uid: string;
    email: string;
    password: string;
    profile: {
      firstName: string,
      lastName: string;
    };
    role: string;
}
