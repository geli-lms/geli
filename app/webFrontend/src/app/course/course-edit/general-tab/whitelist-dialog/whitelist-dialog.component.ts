import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {CourseService, WhitelistUserService} from '../../../../shared/services/data.service';
import {ICourse} from '../../../../../../../../shared/models/ICourse';
import {SnackBarService} from '../../../../shared/services/snack-bar.service';
import {WhitelistService} from '../../../../shared/services/whitelist.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-whitelist-dialog',
  templateUrl: './whitelist-dialog.component.html',
  styleUrls: ['./whitelist-dialog.component.scss']
})
export class WhitelistDialog {

  public whitelistUsers: any[];
  public fileErrors: any[];

  public course: ICourse;

  private translations = { };

  constructor(public dialogRef: MatDialogRef<WhitelistDialog>,
              public courseService: CourseService,
              public snackBar: SnackBarService,
              public whitelistService: WhitelistService,
              public whitelistUserService: WhitelistUserService,
              private translate: TranslateService) {


  }


  async onWhitelistFileChanged(event) {
    const translations = this.translate.instant(['course.whitelistCreated', 'course.whitelistNotReadable']);

    if (event.target && event.target.files && event.target.files.length > 0) {
      const whitelistFile = event.target.files[0];

      const result = <any>await this.whitelistService.parseFile(whitelistFile);
      if (!result || !result.rows || result.rows.length === 0) {
        this.snackBar.openLong(this.translate.instant('course.text.whitelistNoStudents'));
        return;
      }

      const uids = result.rows.map(row => row.uid);
      const whitelistCheckResults = await this.whitelistUserService.checkWhitelistUsers(uids);

      this.whitelistUsers =
        result.rows.map(row => Object.assign(row, whitelistCheckResults.find(single => single.uid === row.uid)));

      this.fileErrors = result.errors;
    }
  }

  async uploadWhitelist() {
    const result = await this.courseService.setWhitelistUsers(this.course._id, this.whitelistUsers);

    if (!result) {
      this.snackBar.openLong(this.translate.instant('course.text.whitelistNotReadable'));
    } else {
      this.snackBar.openLong(this.translate.instant('course.text.whitelistCreated'));
    }

    this.dialogRef.close(result);
  }

}
