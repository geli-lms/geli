import {
  Component, OnInit, ViewEncapsulation, Input, ViewChildren, QueryList, Output,
  EventEmitter
} from '@angular/core';
import {IUnit} from '../../../../../../../../shared/models/units/IUnit';
import {IFileUnit} from '../../../../../../../../shared/models/units/IFileUnit';
import {IVideoUnit} from '../../../../../../../../shared/models/units/IVideoUnit';
import {UploadUnitCheckboxComponent} from './upload-unit-checkbox.component';


@Component({
  selector: 'app-unit-checkbox',
  templateUrl: './unit-checkbox.component.html',
  styleUrls: ['./unit-checkbox.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UnitCheckboxComponent implements OnInit {
  @Input()
  unit: IUnit;
  @Input()
  chkbox = false;
  unitDesc: string;

  @ViewChildren(UploadUnitCheckboxComponent)
  childUnits: QueryList<UploadUnitCheckboxComponent>;

  @Output()
  valueChanged: EventEmitter<any> = new EventEmitter();

  files;
  childUnitDesc: string;

  constructor() {

  }

  ngOnInit() {
    console.log("__t of Unit"+this.unit.name+": "+this.unit.__t);
    switch (this.unit.__t) {
      case 'file':
        const fileUnit = <IFileUnit><any> this.unit;
        this.files = fileUnit.files;
        this.unitDesc = 'File Unit';
        this.childUnitDesc = 'File';
        break;
      case 'task':
        this.unitDesc = 'Task Unit';
        break;
      case 'code-kata':
        this.unitDesc = 'Code-Kata Unit';
        break;
      case 'free-text':
        this.unitDesc = 'Free-Text Unit';
        break;
      default:
    }
  }

  onChange() {
    if (this.files) {
      if (this.chkbox) {
        this.childUnits.forEach(upUnit => {
          if (upUnit.chkbox === false && !upUnit.showDL) {
            upUnit.chkbox = true;
          }
        });
        if (this.noChildsChecked()) {
          this.chkbox = false;
        }
      } else {
        this.childUnits.forEach(upUnit => upUnit.chkbox = false);
      }
    }
    this.valueChanged.emit();
  }

  noChildsChecked(): boolean {
    let noChecked = true;
    this.childUnits.forEach(upUnit => {
      if (upUnit.chkbox === true) {
        noChecked = false;
      }
    });
    return noChecked;
  }

  onChildEvent() {
    let childChecked = false;
    this.childUnits.forEach(unit => {
      if (unit.chkbox === true && !unit.showDL) {
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
