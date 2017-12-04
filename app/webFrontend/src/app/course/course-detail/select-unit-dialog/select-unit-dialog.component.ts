import {Component, Inject, QueryList, ViewChildren, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSnackBar} from '@angular/material';
import {ICourse} from '../../../../../../../shared/models/ICourse';
import {SelectedUnitsService} from '../../../shared/services/selected-units.service';
import {LectureCheckboxComponent} from './lecture-checkbox/lecture-checkbox.component';
import {SaveFileService} from '../../../shared/services/save-file.service';
import {DownloadReq} from 'app/shared/services/data.service';

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
    if (this.selectedUnitsService.unitIds.length > 0) {
      const dl = {course: this.course.name, lectures: [], units: this.selectedUnitsService.getSelectedData()};
      const result = await this.downloadReq.postDownloadReqForCourse(dl);

      const idk = await this.downloadReq.getFile(result.toString());

      console.log(JSON.stringify(idk, null, 2));

      //this.saveFileService.save(this.course.name,'Some Data','.zip', 'file/zip', 'file/zip');

      this.dialogRef.close();
    } else {
      this.snackBar.open('No units selected!', 'Dismiss', {duration: 3000});
    }
  }

}
