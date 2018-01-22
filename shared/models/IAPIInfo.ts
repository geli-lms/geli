export interface IAPIInfo {
  status: string;
  nonProductionWarning: string;
  build_timestamp: Date;
  commit_hash: string;
  sentryDsn: string;
  teacherMailRegex: string;
}
