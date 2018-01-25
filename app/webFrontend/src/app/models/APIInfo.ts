import {IAPIInfo} from '../../../../../shared/models/IAPIInfo';

export class APIInfo implements IAPIInfo {
  sentryDsn: string;
  status: string;
  nonProductionWarning: string;
  build_timestamp: Date;
  commit_hash: string;
  teacherMailRegex: string;
}
