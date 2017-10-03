import {IAPIInfo} from '../../../../../shared/models/IAPIInfo';

export class APIInfo implements IAPIInfo {
  status: string;
  nonProductionWarning: string;
  build_timestamp: Date;
  commit_hash: string;
}
