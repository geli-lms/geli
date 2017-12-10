import {
  Component, OnInit, ViewEncapsulation, Input, ViewChildren, QueryList, Output,
  EventEmitter
} from '@angular/core';
import {IUnit} from '../../../../../../../../../shared/models/units/IUnit';
import {SelectedUnitsService} from '../../../../../shared/services/selected-units.service';
import {IFileUnit} from '../../../../../../../../../shared/models/units/IFileUnit';
import {IVideoUnit} from '../../../../../../../../../shared/models/units/IVideoUnit';
import {UploadUnitCheckboxComponent} from "./upload-unit-checkbox/upload-unit-checkbox.component";


@Component({
  selector: 'app-unit-checkbox',
  templateUrl: './unit-checkbox.component.html',
  styleUrls: ['./unit-checkbox.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UnitCheckboxComponent implements OnInit {
  @Input()
  unit : IUnit;
  @Input()
  chkbox: boolean;

  @ViewChildren(UploadUnitCheckboxComponent)
  childUnits: QueryList<UploadUnitCheckboxComponent>;

  @Output()
  valueChanged: EventEmitter<any> = new EventEmitter();

  files;

  constructor(private selectedUnitsService: SelectedUnitsService ) {
    this.chkbox = false;
  }

  ngOnInit() {
    if (this.unit.type === 'video') {
      const videoUnit = <IVideoUnit><any> this.unit;
      this.files = videoUnit.files;
    } else if (this.unit.type === 'file') {
      const fileUnit = <IFileUnit><any> this.unit;
      this.files = fileUnit.files;
    }
  }

  onChange() {
    if (this.files) {
      if (this.chkbox) {
        this.childUnits.forEach(upUnit => {
          if (upUnit.chkbox === false) {
            upUnit.chkbox = true;
          }
        });
      } else {
        this.childUnits.forEach(upUnit => upUnit.chkbox = false);
      }
    }
    this.valueChanged.emit();
  }

  onChildEvent() {
    let childChecked = false;
    this.childUnits.forEach(unit => {
      if (unit.chkbox == true) {
        childChecked = true;
        this.chkbox = true;
      }
    });
    if (!childChecked) {
      this.chkbox = false;
    }
  }

}
