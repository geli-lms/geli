import {IInfo} from '../../../shared/models/IInfo';
import config from '../config/main';

export class Info implements IInfo {
  status: string;
  nonProductionWarning: string;

  constructor(status: string) {
    this.status = status;
    this.nonProductionWarning = config.nonProductionWarning;
  }
}
