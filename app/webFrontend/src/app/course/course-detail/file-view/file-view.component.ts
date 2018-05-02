import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ICourse} from '../../../../../../../shared/models/ICourse';
import {CourseService} from '../../../shared/services/data.service';
import {DataSharingService} from '../../../shared/services/data-sharing.service';
import {IUnit} from '../../../../../../../shared/models/units/IUnit';
import {IFileUnit} from '../../../../../../../shared/models/units/IFileUnit';
import {IFile} from '../../../../../../../shared/models/mediaManager/IFile';

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
    console.dir(this.course);
  }

  listview() {
    this.displayGrid = false;
  }

  gridview() {
    this.displayGrid = true;
  }

  checkSelection() {
    if (this.selectedValue === 'file') {
      this.disableGridViewButton = true;
    } else if (this.selectedValue === 'video') {
      this.disableGridViewButton = false;
    }
  }
}
