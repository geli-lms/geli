import {ICourse} from '../../../../../../shared/models/ICourse';
import {IAssignmentUnit} from '../../../../../../shared/models/units/IAssignmentUnit';
import {IUser} from "../../../../../../shared/models/IUser";
import {IAssignment} from "../../../../../../shared/models/assignment/IAssignment";

export class AssignmentUnit implements IAssignmentUnit {
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

    deadline: string;
    assignments: IAssignment[] = [];

    constructor(_course: ICourse) {
        this._course = _course;
        this.__t = 'assignment';
        this.progressable = true;
        this.weight = 0;
        this.visible = true;
    }
}