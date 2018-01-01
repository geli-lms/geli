import {
  Component, OnInit, ViewEncapsulation, Input, ViewChildren, QueryList, Output,
  EventEmitter
} from '@angular/core';
import {IUnit} from '../../../../../../../../../shared/models/units/IUnit';
import {IFileUnit} from '../../../../../../../../../shared/models/units/IFileUnit';
import {IVideoUnit} from '../../../../../../../../../shared/models/units/IVideoUnit';
import {UploadUnitCheckboxComponent} from './upload-unit-checkbox/upload-unit-checkbox.component';


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
  unit_desc: string;

  @ViewChildren(UploadUnitCheckboxComponent)
  childUnits: QueryList<UploadUnitCheckboxComponent>;

  @Output()
  valueChanged: EventEmitter<any> = new EventEmitter();

  files;
  child_unit_desc: string;

  constructor() {

  }

  ngOnInit() {
    switch (this.unit.type) {
      case 'video':
        const videoUnit = <IVideoUnit><any> this.unit;
        this.files = videoUnit.files;
        this.unit_desc = 'Video Unit';
        this.child_unit_desc = 'Video';
        break;
      case 'file':
        const fileUnit = <IFileUnit><any> this.unit;
        this.files = fileUnit.files;
        this.unit_desc = 'File Unit';
        this.child_unit_desc = 'File';
        break;
      case 'task':
        this.unit_desc = 'Task Unit';
        break;
      case 'code-kata':
        this.unit_desc = 'Code-Kata Unit';
        break;
      case 'free-text':
        this.unit_desc = 'Free-Text Unit';
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

  noChildsChecked() :boolean {
    let noChecked = true;
    this.childUnits.forEach(upUnit => {
      if (upUnit.chkbox == true) {
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
