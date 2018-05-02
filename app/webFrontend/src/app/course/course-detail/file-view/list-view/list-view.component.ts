import {Component, Input, OnInit} from '@angular/core';
import {IFile} from '../../../../../../../../shared/models/mediaManager/IFile';

@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.scss']
})
export class ListViewComponent implements OnInit {
  @Input() file: IFile;

  constructor() {
  }

  ngOnInit() {
  }
}
