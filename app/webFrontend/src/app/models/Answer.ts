import {IAnswer} from '../../../../../shared/models/task/IAnswer';

export class Answer implements IAnswer {
  _id: any;
  value: boolean;
  text: string;
}
