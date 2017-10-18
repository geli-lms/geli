import {IAPIInfo} from '../../../shared/models/IAPIInfo';
import config from '../config/main';

export class APIInfo implements IAPIInfo {
  status: string;
  nonProductionWarning: string;
  build_timestamp: Date;
  commit_hash: string;

  constructor(status: string) {
    this.status = status;
    this.nonProductionWarning = config.nonProductionWarning;
    this.build_timestamp = undefined;
    this.commit_hash = undefined;
  }
}
