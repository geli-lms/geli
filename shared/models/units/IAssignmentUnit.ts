import {IUnit} from './IUnit';
import {IAssignment} from "../assignment/IAssignment";
import {IChatRoom} from "../IChatRoom";


export interface IAssignmentUnit extends IUnit {
  deadline: string;
  assignments: IAssignment[];
  chatRoom: IChatRoom;
}
