import {IUnit} from './IUnit';

export interface ICodeKataUnit extends IUnit {
  definition: string;
  code: string;
  test: string;
  deadline: string;
}
