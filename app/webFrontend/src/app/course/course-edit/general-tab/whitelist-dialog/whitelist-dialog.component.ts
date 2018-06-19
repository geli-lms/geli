import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {CourseService} from '../../../../shared/services/data.service';
import {ICourse} from '../../../../../../../../shared/models/ICourse';
import {SnackBarService} from '../../../../shared/services/snack-bar.service';
import {WhitelistService} from "../../../../shared/services/whitelist.service";

@Component({
  selector: 'app-whitelist-dialog',
  templateUrl: './whitelist-dialog.component.html',
  styleUrls: ['./whitelist-dialog.component.scss']
})
export class WhitelistDialog {

  public whitelistUsers: any[];
  public fileErrors: any[];

  public course: ICourse;

  constructor(public dialogRef: MatDialogRef<WhitelistDialog>,
              public courseService: CourseService,
              public snackBar: SnackBarService,
              public whitelistService: WhitelistService) {

  }


  async onWhitelistFileChanged(event) {
    if (event.target && event.target.files && event.target.files.length > 0) {
      const whitelistFile = event.target.files[0];

      const result = <any>await this.whitelistService.parseFile(whitelistFile);
      if (!result || !result.rows || result.rows.length === 0) {
        this.snackBar.openLong('The CSV file does not contain any students to import.');
        return;
      }

      this.whitelistUsers = result.rows;
      this.fileErrors = result.errors;
    }
  }

  async uploadWhitelist() {
    const result = await this.courseService.setWhitelistUsers(this.course._id, this.whitelistUsers);

    if (!result) {
      this.snackBar.openLong('The CSV file could not be read. Do you have the right file?');
    } else {
      this.snackBar.openLong('The whitelist has been set. Don`t forget to save the course.');
    }

    this.dialogRef.close(result);
  }

}
