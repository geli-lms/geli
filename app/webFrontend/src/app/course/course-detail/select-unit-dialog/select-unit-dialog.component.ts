import {Component, Inject, QueryList, ViewChildren, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSnackBar} from '@angular/material';
import {ICourse} from '../../../../../../../shared/models/ICourse';
import {SelectedUnitsService} from '../../../shared/services/selected-units.service';
import {LectureCheckboxComponent} from './lecture-checkbox/lecture-checkbox.component';
import {SaveFileService} from '../../../shared/services/save-file.service';
import {DownloadReq} from 'app/shared/services/data.service';
import {IDownload} from '../../../../../../../shared/models/IDownload';

@Component({
  selector: 'app-select-unit-dialog',
  templateUrl: './select-unit-dialog.component.html',
  styleUrls: ['./select-unit-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SelectUnitDialogComponent {
  course: ICourse;
  chkbox: boolean;
  @ViewChildren(LectureCheckboxComponent)
  childLectures: QueryList<LectureCheckboxComponent>;

  constructor(public dialogRef: MatDialogRef<SelectUnitDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private selectedUnitsService: SelectedUnitsService,
              private downloadReq: DownloadReq,
              private saveFileService: SaveFileService,
              public snackBar: MatSnackBar) {
    this.course = data.course;
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

  async downloadAndClose() {
    // Iterate through structure, build obj with positive bool values.
    if (this.childLectures.length === 0) {
      this.snackBar.open('No units selected!', 'Dismiss', {duration: 3000});
      return;
    }

    const obj = await this.buildObject();
    const downloadObj = <IDownload> obj;
    // hier prüfen ob keine Units || zu groß

    const result = await this.downloadReq.postDownloadReqForCourse(downloadObj);
    const response = await this.downloadReq.getFile(result.toString());

    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(response);
    link.download = this.course.name + '.zip';
    link.click();
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
            if (unit.unit.type === 'Video' || unit.unit.type === 'File') {
              let files;
              unit.childUnits.forEach((file, index) => {
                if (file.chkbox) {
                  files.push(index);
                }
              });
              units.push({id: unit.unit._id, files: files});
            } else {
              units.push({id: unit.unit._id});
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
