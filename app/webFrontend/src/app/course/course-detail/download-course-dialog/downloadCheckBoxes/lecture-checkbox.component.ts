import {
  Component, OnInit, ViewEncapsulation, Input, ViewChildren, QueryList, Output,
  EventEmitter, AfterViewChecked, ChangeDetectorRef
} from '@angular/core';
import {ILecture} from '../../../../../../../../shared/models/ILecture';
import {UnitCheckboxComponent} from './unit-checkbox.component';
import {IUnit} from '../../../../../../../../shared/models/units/IUnit';

@Component({
  selector: 'app-lecture-checkbox',
  templateUrl: './lecture-checkbox.component.html',
  styleUrls: ['./lecture-checkbox.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LectureCheckboxComponent implements OnInit, AfterViewChecked {
  @Input()
  chkbox: boolean;
  @Input()
  lecture: ILecture;
  @ViewChildren(UnitCheckboxComponent)
  childUnits: QueryList<UnitCheckboxComponent>;
  @Output()
  valueChanged: EventEmitter<any> = new EventEmitter();
  showCheckBox = true;

  units: IUnit[];

  constructor(private changeDetector: ChangeDetectorRef) {
    this.chkbox = false;
  }

  ngOnInit() {
    this.units = this.lecture.units.filter(unit => {
      return unit.__t !== 'assignment';
    });
  }

  ngAfterViewChecked() {
    this.showCheckBox = this.childUnits.toArray().some((unit: UnitCheckboxComponent) => {
      return unit.showCheckBox === true;
    });
    // force angular to detect the change otherwise an error(ExpressionChangedAfterItHasBeenCheckedError) is threw.
    // see: https://github.com/angular/angular/issues/17572
    this.changeDetector.detectChanges();
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
