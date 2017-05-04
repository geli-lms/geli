export interface IUser {
    _id: any;
    username: string;
    email: string;
    password: string;
    profile: {
      firstName: string,
      lastName: string;
    };
    role: string;
}
