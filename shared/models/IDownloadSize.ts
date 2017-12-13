export interface IDownloadSize {
  // Should be in Megabyte
  totalSize: number;
  // Contains all filenames which are too large
  tooLargeFiles: Array<string>;
}
