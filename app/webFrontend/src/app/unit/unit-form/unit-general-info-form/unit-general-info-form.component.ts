import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-unit-general-info-form',
  templateUrl: './unit-general-info-form.component.html',
  styleUrls: ['./unit-general-info-form.component.scss']
})
export class UnitGeneralInfoFormComponent implements OnInit {

  @Input()
  public model: any;

  public form: FormGroup;

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    if (this.model !== null && this.model !== undefined && this.model.visible === undefined) {
      this.model.visible = true;
    }
    this.form = this.formBuilder.group({
      name: [this.model ? this.model.name : '', Validators.required],
      description: [this.model ? this.model.description : ''],
      deadline: [this.model ? this.model.deadline : ''],
      visible: [this.model ? this.model.visible : false]
    });
  }

  updateDateTime(date: Date) {
    // TODO: selectedChanged event is deprecated
    // set time to 23:59
    date.setHours(23);
    date.setMinutes(59);
  }
}
