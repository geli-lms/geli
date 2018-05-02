import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';

@Component({
  selector: 'app-unit-general-info-form',
  templateUrl: './unit-general-info-form.component.html',
  styleUrls: ['./unit-general-info-form.component.scss']
})
export class UnitGeneralInfoFormComponent implements OnInit {

  @Input() public model: any;
  @Input() unitForm: FormGroup;

  public form: FormGroup;

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.unitForm.addControl('name', new FormControl(this.model.name, Validators.required));
    this.unitForm.addControl('description', new FormControl(this.model.description, Validators.required));
    this.unitForm.addControl('deadline', new FormControl(this.model.deadline));
    // this.unitForm.addControl("visible", new FormControl(this.model.visible));
  }

  updateDateTime(date: Date) {
    // TODO: selectedChanged event is deprecated
    // set time to 23:59
    date.setHours(23);
    date.setMinutes(59);
  }
}
