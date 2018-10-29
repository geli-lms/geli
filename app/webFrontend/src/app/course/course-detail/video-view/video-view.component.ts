import {Component, Input, OnInit} from '@angular/core';
import {IFile} from '../../../../../../../shared/models/mediaManager/IFile';
import {ICourse} from '../../../../../../../shared/models/ICourse';
import {DataSharingService} from '../../../shared/services/data-sharing.service';
import {IFileUnit} from '../../../../../../../shared/models/units/IFileUnit';

@Component({
  selector: 'app-list-view',
  templateUrl: './video-view.component.html',
  styleUrls: ['./video-view.component.scss']
})
export class VideoViewComponent implements OnInit {
  @Input() file: IFile;
  course: ICourse;
  displayGrid = true;

  constructor(private dataSharingService: DataSharingService) {
  }

  ngOnInit() {
    this.course = this.dataSharingService.getDataForKey('course');
  }

  checkForFileUnits(): boolean {
    let returnVal = false;
    this.course.lectures.forEach(lec => {
      lec.units.forEach(unit => {
        if (unit.__t === 'file') {
          const videoUnit = unit as IFileUnit;
          if (videoUnit.fileUnitType === 'video') {
            returnVal = true;
          }
        }
      });
    });
    return returnVal;
  }

  listview() {
    this.displayGrid = false;
  }

  gridview() {
    this.displayGrid = true;
  }
}
