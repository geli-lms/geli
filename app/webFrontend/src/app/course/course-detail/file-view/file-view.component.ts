import {Component, Input, OnInit} from '@angular/core';
import {ICourse} from '../../../../../../../shared/models/ICourse';
import {DataSharingService} from '../../../shared/services/data-sharing.service';
import {IFileUnit} from '../../../../../../../shared/models/units/IFileUnit';

@Component({
  selector: 'app-file-view',
  templateUrl: './file-view.component.html',
  styleUrls: ['./file-view.component.scss']
})
export class FileViewComponent implements OnInit {
  course: ICourse;
  types = [
    {value: 'video', label: 'Videos'},
    {value: 'file', label: 'Files'},
  ];
  selectedValue: string = this.types[0].value;
  displayGrid = true;
  disableGridViewButton = false;

  constructor(private dataSharingService: DataSharingService) {
  }

  ngOnInit() {
    this.course = this.dataSharingService.getDataForKey('course');
  }

  listview() {
    this.displayGrid = false;
  }

  gridview() {
    this.displayGrid = true;
  }

  checkSelection() {
    if (this.selectedValue === 'file') {
      this.listview();
      this.disableGridViewButton = true;
    } else if (this.selectedValue === 'video') {
      this.disableGridViewButton = false;
    }
  }

  checkForFileUnits(): boolean {
    let returnVal = false;
    this.course.lectures.forEach(lec => {
      lec.units.forEach(unit => {
        if (unit.__t === 'file') {
          returnVal = true;
        }
      });
    });
    return returnVal;
  }

}
