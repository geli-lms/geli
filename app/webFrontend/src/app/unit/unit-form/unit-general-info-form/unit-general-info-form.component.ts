import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {UnitFormService} from '../../../shared/services/unit-form.service';

@Component({
  selector: 'app-unit-general-info-form',
  templateUrl: './unit-general-info-form.component.html',
  styleUrls: ['./unit-general-info-form.component.scss']
})
export class UnitGeneralInfoFormComponent implements OnInit {

  model: any;

  unitForm: FormGroup;

  public form: FormGroup;

  constructor(private formBuilder: FormBuilder,
              public unitFormService: UnitFormService
              ) {
  }

  ngOnInit() {
    this.model = this.unitFormService.model;
    this.unitForm = this.unitFormService.unitForm;

    if (this.model !== null && this.model !== undefined && this.model.visible === undefined) {
      this.model.visible = true;
    }

    this.unitForm.addControl('name', new FormControl(null, Validators.required));
    this.unitForm.addControl('description', new FormControl(null));
    this.unitForm.addControl('deadline', new FormControl());
    this.unitForm.addControl('visible', new FormControl());

    if (this.model) {
      this.unitForm.patchValue({
        name: this.model.name,
        description: this.model.description,
        deadline: this.model.deadline,
        visible: this.model.visible
      });
    }

  }
}
