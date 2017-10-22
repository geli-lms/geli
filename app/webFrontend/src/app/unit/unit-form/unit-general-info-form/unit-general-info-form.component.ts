import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {IUnit} from '../../../../../../../shared/models/units/IUnit';

@Component({
  selector: 'app-unit-general-info-form',
  templateUrl: './unit-general-info-form.component.html',
  styleUrls: ['./unit-general-info-form.component.scss']
})
export class UnitGeneralInfoFormComponent implements OnInit {

  @Input()
  public model: IUnit;

  public form: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      name: [this.model ? this.model.name : '', Validators.required],
      description: [this.model ? this.model.description : '', Validators.required]
    });
  }
}
