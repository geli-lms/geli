import {Component, OnInit, Input} from '@angular/core';
import {IFileUnit} from '../../../../../../shared/models/units/IFileUnit';

@Component({
  selector: 'app-file-unit',
  templateUrl: './file-unit.component.html',
  styleUrls: ['./file-unit.component.scss']
})
export class FileUnitComponent implements OnInit {

  @Input() fileUnit: IFileUnit;

  constructor() {
  }

  ngOnInit() {
  }

  isPicture(fileName: string) {
    const pictureExt: any = [
      'jpg',
      'jpeg',
      'png',
      'apng',
      'svg',
      'bmp',
      'ico',
    ];
    const extPos = fileName.lastIndexOf('.');
    if (extPos === -1) {
      return false;
    }
    const ext = fileName.substr(extPos + 1);
    return pictureExt.includes(ext);
  }

}
