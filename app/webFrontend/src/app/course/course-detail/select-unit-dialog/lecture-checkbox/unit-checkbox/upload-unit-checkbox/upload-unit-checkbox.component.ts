import {Component, Input, Output, OnInit, EventEmitter} from '@angular/core';
import {IFile} from '../../../../../../../../../../shared/models/IFile';
import {BackendService} from '../../../../../../shared/services/backend.service';

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

  downloadFile() {
    const downloadLink = BackendService.API_URL + '/uploads/' + this.file.name;
    console.log(downloadLink);
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(downloadLink, this.file.alias);
    } else {
      const e = document.createEvent('MouseEvents'),
        a = document.createElement('a');
      a.download = this.file.alias;
      a.href = downloadLink;
      a.dataset.downloadurl = [a.download, a.href].join(':');
      e.initEvent('click', true, false);
      a.dispatchEvent(e);
    }
  }

}


