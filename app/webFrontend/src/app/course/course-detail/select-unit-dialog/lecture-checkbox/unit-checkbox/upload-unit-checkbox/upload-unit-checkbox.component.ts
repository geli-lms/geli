import {Component, Input, Output, OnInit, EventEmitter} from '@angular/core';
import {IFile} from '../../../../../../../../../../shared/models/IFile';

@Component({
  selector: 'app-upload-unit-checkbox',
  templateUrl: './upload-unit-checkbox.component.html',
  styleUrls: ['./upload-unit-checkbox.component.scss']
})
export class UploadUnitCheckboxComponent implements OnInit {
  @Input()
  file: IFile;
  @Input()
  chkbox = false;
  @Input()
  showDL = false;
  @Input()
  linkDL: string;
  @Input()
  unit_desc: string;
  @Output()
  valueChanged: EventEmitter<any> = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

  emitEvent() {
    if (this.showDL) {
      this.chkbox = false;
    }
    this.valueChanged.emit();
  }

  dlFile() {
  }

}


