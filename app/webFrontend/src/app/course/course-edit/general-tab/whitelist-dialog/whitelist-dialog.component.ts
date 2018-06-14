import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {CourseService} from '../../../../shared/services/data.service';
import {ICourse} from '../../../../../../../../shared/models/ICourse';
import {SnackBarService} from '../../../../shared/services/snack-bar.service';

@Component({
  selector: 'app-whitelist-dialog',
  templateUrl: './whitelist-dialog.component.html',
  styleUrls: ['./whitelist-dialog.component.scss']
})
export class WhitelistDialog {

  public whitelistUsers: any[];
  public course: ICourse;

  constructor(public dialogRef: MatDialogRef<WhitelistDialog>,
              public courseService: CourseService,
              public snackBar: SnackBarService) {

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
