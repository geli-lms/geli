import {IUnit} from './IUnit';
import {IAssignment} from "../assignment/IAssignment";


export interface IAssignmentUnit extends IUnit {
  deadline: string;
  assignments: IAssignment[];
}
