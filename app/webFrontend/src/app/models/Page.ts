import {IPage} from '../../../../../shared/models/IPage';

export class Page implements IPage {
  _id: any;
  accessLevel: string;
  content: string;
  path: string;
  title: string;
  language: string;

  constructor() {
    this.content = '';
  }
}
