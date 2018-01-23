import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProgressComponent implements OnInit {

  @Input() progress;
  @Input() unit;

  constructor() { }

  ngOnInit() {
    if (!this.progress && this.unit.progressData) {
      this.progress = this.unit.progressData;
    }
  }

}
