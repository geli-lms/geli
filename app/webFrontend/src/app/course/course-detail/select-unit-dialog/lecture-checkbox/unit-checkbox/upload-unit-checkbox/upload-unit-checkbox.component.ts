import {Component, Input, Output, OnInit, EventEmitter} from '@angular/core';
import {IFile} from "../../../../../../../../../../shared/models/IFile";
import {IVideoUnit} from "../../../../../../../../../../shared/models/units/IVideoUnit";
import {IFileUnit} from "../../../../../../../../../../shared/models/units/IFileUnit";

@Component({
  selector: 'app-upload-unit-checkbox',
  templateUrl: './upload-unit-checkbox.component.html',
  styleUrls: ['./upload-unit-checkbox.component.scss']
})
export class UploadUnitCheckboxComponent implements OnInit {
  @Input()
  file: IFile;
  @Input()
  chkbox: boolean;
  @Input()
  showDL: boolean;
  @Input()
  unit_desc: string;
  @Output()
  valueChanged: EventEmitter<any> = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
    this.chkbox = false;
    this.showDL = false;
  }

  emitEvent() {
    this.valueChanged.emit();
  }

  dlFile() {

  }

}


