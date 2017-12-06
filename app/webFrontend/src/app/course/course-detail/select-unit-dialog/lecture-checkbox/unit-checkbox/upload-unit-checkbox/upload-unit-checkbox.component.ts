import {Component, Input, OnInit} from '@angular/core';
import {IFile} from "../../../../../../../../../../shared/models/IFile";

@Component({
  selector: 'app-upload-unit-checkbox',
  templateUrl: './upload-unit-checkbox.component.html',
  styleUrls: ['./upload-unit-checkbox.component.scss']
})
export class UploadUnitCheckboxComponent implements OnInit {
  @Input()
  icon_name: string;
  @Input()
  file: IFile;
  @Input()
  chkbox: boolean;

  constructor() { }

  ngOnInit() {
    this.chkbox = false;
  }

}
