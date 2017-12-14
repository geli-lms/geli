import {Component, Inject, OnInit, QueryList, ViewChildren, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSnackBar} from '@angular/material';
import {ICourse} from '../../../../../../../shared/models/ICourse';
import {LectureCheckboxComponent} from './lecture-checkbox/lecture-checkbox.component';
import {DownloadReq} from 'app/shared/services/data.service';
import {IDownload} from '../../../../../../../shared/models/IDownload';
import {IDownloadSize} from "../../../../../../../shared/models/IDownloadSize";

@Component({
  selector: 'app-select-unit-dialog',
  templateUrl: './select-unit-dialog.component.html',
  styleUrls: ['./select-unit-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SelectUnitDialogComponent implements OnInit{
  course: ICourse;
  chkbox: boolean;
  showSpinner: boolean;
  @ViewChildren(LectureCheckboxComponent)
  childLectures: QueryList<LectureCheckboxComponent>;

  constructor(public dialogRef: MatDialogRef<SelectUnitDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private downloadReq: DownloadReq,
              public snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.showSpinner = false;
    this.course = this.data.course;
    this.chkbox = false;
  }

  onChange() {
    if (this.chkbox) {
      this.childLectures.forEach(lecture => {
        if (lecture.chkbox === false) {
          lecture.chkbox = true;
          lecture.onChange();
        }
      });
    } else {
      this.childLectures.forEach(lecture => lecture.chkbox = false);
      this.childLectures.forEach(unit => unit.onChange());
    }
  }

  onChildEvent() {
    let childChecked = false;
    this.childLectures.forEach(lec => {
      if (lec.chkbox == true) {
        childChecked = true;
        this.chkbox = true;
      }
    });
    if (!childChecked) {
      this.chkbox = false;
    }
  }

  async downloadAndClose() {
    const obj = await this.buildObject();
    if (obj.lectures.length === 0) {
      this.snackBar.open('No units selected!', 'Dismiss', {duration: 3000});
      return;
    }
    const downloadObj = <IDownload> obj;
    this.showSpinner = true;
    const sizeResult = await this.downloadReq.getPackageSize(downloadObj);
    const iDownload = <IDownloadSize><any>sizeResult;
    console.dir(iDownload);
    if (iDownload.tooLargeFiles.length == 0) {
      const result = await this.downloadReq.postDownloadReqForCourse(downloadObj);
      const response = await this.downloadReq.getFile(result.toString());
      this.showSpinner = false;
      var link = document.createElement('a');
      link.href = window.URL.createObjectURL(response);
      link.download = this.course.name + '.zip';
      link.click();
    } else {
      // TODO: Test withg large video file, once i get one.
      this.snackBar.open('The selected files are too big! Please download the red-marked files seperately!', 'Okay', {duration: 3000});
        iDownload.tooLargeFiles.forEach(file => {
          this.childLectures.forEach(lecture => {
            lecture.childUnits.forEach(unit => {
              if (unit.files) {
                unit.childUnits.forEach(fileUnit => {
                  if (fileUnit.file.path == file ) {
                    fileUnit.redText = true;
                  }
                });
              }
            });
          });
        });
    }
    //this.saveFileService.save(this.course.name,'Some Data','.zip', 'file/zip', 'file/zip');
    this.dialogRef.close();
  }

  buildObject() {
    let lectures = [];
    this.childLectures.forEach(lec => {
      if (lec.chkbox) {
        let units = [];
        lec.childUnits.forEach(unit => {
          if (unit.chkbox) {
            if (unit.unit.type === 'video' || unit.unit.type === 'file') {
              let files = [];
              unit.childUnits.forEach((file, index) => {
                if (file.chkbox) {
                  files.push(index);
                }
              });
              units.push({unitId: unit.unit._id, files: files});
            } else {
              units.push({unitId: unit.unit._id});
            }
          }
        });
        lectures.push({lectureId: lec.lecture._id, units: units});
      }
    });

    let downloadObj = {courseName: this.course._id, lectures: lectures};
    return downloadObj;
  }

}
