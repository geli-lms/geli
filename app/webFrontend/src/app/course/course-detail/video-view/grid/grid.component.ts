import {Component, Input} from '@angular/core';
import {IFile} from '../../../../../../../../shared/models/mediaManager/IFile';


@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent {
  @Input() file: IFile;
  constructor() {
  }
}
