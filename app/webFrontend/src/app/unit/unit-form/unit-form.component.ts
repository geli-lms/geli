import {Component, OnInit, Input} from '@angular/core';
import {ICourse} from '../../../../../../shared/models/ICourse';
import {ILecture} from '../../../../../../shared/models/ILecture';
import {IUnit} from '../../../../../../shared/models/units/IUnit';
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-unit-form',
  templateUrl: './unit-form.component.html',
  styleUrls: ['./unit-form.component.scss']
})
export class UnitFormComponent implements OnInit {

  @Input() model: IUnit;
  @Input() type: string;
  @Input() course: ICourse;
  @Input() lecture: ILecture;
  @Input() onDone: () => void;
  @Input() onCancel: () => void;

  unitForm: FormGroup;
  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.unitForm = new FormGroup({});
  }
}
