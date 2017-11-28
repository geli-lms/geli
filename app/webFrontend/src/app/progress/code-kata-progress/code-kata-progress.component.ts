import {Component, Input, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {ICodeKataProgress} from '../../../../../../shared/models/ICodeKataProgress';
import {AceEditorComponent} from 'ng2-ace-editor';

@Component({
  selector: 'app-code-kata-progress',
  templateUrl: './code-kata-progress.component.html',
  styleUrls: ['./code-kata-progress.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CodeKataProgressComponent implements OnInit {

  @Input() progress: ICodeKataProgress;

  constructor() { }

  ngOnInit() {
  }

}
