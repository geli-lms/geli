import {Component, Input, OnInit} from '@angular/core';
import {ICourse} from '../../../../../../../shared/models/ICourse';
import {DataSharingService} from '../../../shared/services/data-sharing.service';
import {IFileUnit} from '../../../../../../../shared/models/units/IFileUnit';
import {FileIconService} from '../../../shared/services/file-icon.service';

@Component({
  selector: 'app-file-view',
  templateUrl: './file-view.component.html',
  styleUrls: ['./file-view.component.scss']
})
export class FileViewComponent implements OnInit {
  course: ICourse;

  constructor(private dataSharingService: DataSharingService, private fileIcon: FileIconService) {
  }

  ngOnInit() {
    this.course = this.dataSharingService.getDataForKey('course');
  }

  checkForFileUnits(): boolean {
    let returnVal = false;
    this.course.lectures.forEach(lec => {
      lec.units.forEach(unit => {
        if (unit.__t === 'file') {
          const fileUnit = unit as IFileUnit;
          if (fileUnit.fileUnitType === 'file') {
            returnVal = true;
          }
        }
      });
    });
    return returnVal;
  }

}
