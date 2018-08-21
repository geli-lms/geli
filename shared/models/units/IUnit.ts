import {IUser} from '../IUser';
import {IChatRoom} from '../IChatRoom';

export interface IUnit {
    _id: any;
    _course: any;
    name: string;
    description: string;
    type: string;
    progressable: boolean;
    progressData?: any;
    weight: number;
    updatedAt: string;
    createdAt: string;
    unitCreator: IUser;
    visible: boolean;
    __t: string;
    chatRoom: IChatRoom;
}
