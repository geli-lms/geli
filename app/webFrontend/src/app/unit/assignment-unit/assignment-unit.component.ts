import { Component, OnInit } from '@angular/core';
import {UnitFormService} from "../../shared/services/unit-form.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {IAssignmentUnit} from "../../../../../../shared/models/units/IAssignmentUnit";

@Component({
  selector: 'app-assignment-unit',
  templateUrl: './assignment-unit.component.html',
  styleUrls: ['./assignment-unit.component.scss']
})
export class AssignmentUnitComponent implements OnInit {
    unitForm: FormGroup;
    model: IAssignmentUnit;

    constructor(public unitFormService: UnitFormService,
                public formBuilder: FormBuilder){ }

    ngOnInit() {
        this.unitFormService.unitInfoText = 'Assignments Info';
        this.unitFormService.headline = 'Assignments';

        this.unitForm = this.unitFormService.unitForm;

        this.unitForm.addControl('deadline', new FormControl(this.model.deadline));
        this.unitForm.addControl('assignments', new FormControl(this.model.assignments));

        if (this.model) {
            this.unitForm.patchValue({
                deadline: this.model.deadline,
                assignments: this.model.assignments
            });
        }
    }
}
