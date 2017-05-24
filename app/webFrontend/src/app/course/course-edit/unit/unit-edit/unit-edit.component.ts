import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import {ICourse} from '../../../../../../../../shared/models/ICourse';

@Component({
  selector: 'app-unit-edit',
  templateUrl: './unit-edit.component.html',
  styleUrls: ['./unit-edit.component.scss']
})
export class UnitEditComponent implements OnInit {

  @Input() unitType: string;
  @Input() course: ICourse;
  @Output() onDone = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  public done() {
    this.onDone.emit(true);
  }
}
