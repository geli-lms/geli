export interface IDownload {
  courseName: string;
  lectures: [{
    lectureId: string;
    units: [{
      unitId: string;
      files?: Array<Number>
    }]
  }];
}
