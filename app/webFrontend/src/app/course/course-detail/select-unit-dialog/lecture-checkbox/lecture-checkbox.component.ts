import {
  Component, OnInit, ViewEncapsulation, Input, ViewChildren, QueryList, Output,
  EventEmitter
} from '@angular/core';
import {ILecture} from '../../../../../../../../shared/models/ILecture';
import {UnitCheckboxComponent} from './unit-checkbox/unit-checkbox.component';

@Component({
  selector: 'app-lecture-checkbox',
  templateUrl: './lecture-checkbox.component.html',
  styleUrls: ['./lecture-checkbox.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LectureCheckboxComponent implements OnInit {
  @Input()
  chkbox: boolean;
  @Input()
  lecture: ILecture;
  @ViewChildren(UnitCheckboxComponent)
  childUnits: QueryList<UnitCheckboxComponent>;
  @Output()
  valueChanged: EventEmitter<any> = new EventEmitter();

  constructor() {
    this.chkbox = false;
  }

  ngOnInit() {
  }

  onChange() {
    if (this.chkbox) {
      this.childUnits.forEach(unit => {
        if (unit.chkbox === false) {
          unit.chkbox = true;
          unit.onChange();
        }
      });
    } else {
      this.childUnits.forEach(unit => unit.chkbox = false);
      this.childUnits.forEach(unit => unit.onChange());
    }
    this.valueChanged.emit();
  }

  onChildEvent(event) {
    let childChecked = false;
    this.childUnits.forEach(unit => {
      if (unit.chkbox === true) {
        childChecked = true;
        this.chkbox = true;
      }
    });
    if (!childChecked) {
      this.chkbox = false;
    }
    this.valueChanged.emit();
  }
}
