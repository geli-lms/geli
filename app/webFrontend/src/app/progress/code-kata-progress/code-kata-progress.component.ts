import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {ICodeKataUnitProgress} from '../../../../../../shared/models/progress/ICodeKataProgress';

@Component({
  selector: 'app-code-kata-progress',
  templateUrl: './code-kata-progress.component.html',
  styleUrls: ['./code-kata-progress.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CodeKataProgressComponent implements OnInit {

  @Input() progress: ICodeKataUnitProgress;

  constructor() { }

  ngOnInit() {
  }

}
