import {Component, Input, Output, OnInit, EventEmitter} from '@angular/core';
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
  @Input()
  redText: boolean;
  @Output()
  valueChanged: EventEmitter<any> = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
    this.chkbox = false;
    this.redText = false;
  }

  emitEvent() {
    this.valueChanged.emit();
  }
}


