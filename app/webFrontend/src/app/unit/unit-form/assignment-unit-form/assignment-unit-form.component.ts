import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {UnitFormService} from '../../../shared/services/unit-form.service';
import {IAssignmentUnit} from '../../../../../../../shared/models/units/IAssignmentUnit';
import {IAssignment} from '../../../../../../../shared/models/assignment/IAssignment';

@Component({
  selector: 'app-assignment-unit-form',
  templateUrl: './assignment-unit-form.component.html',
  styleUrls: ['./assignment-unit-form.component.scss']
})
export class AssignmentUnitFormComponent implements OnInit {
    unitForm: FormGroup;
    model: IAssignmentUnit;

    constructor(public unitFormService: UnitFormService,
                public formBuilder: FormBuilder) { }

    ngOnInit() {
        this.unitFormService.unitInfoText = 'Assignments Info';
        this.unitFormService.headline = 'Assignments';

        this.unitForm = this.unitFormService.unitForm;

        this.unitForm.addControl('deadline', new FormControl());
        this.unitForm.addControl('assignments', new FormControl());

        if (this.model) {
            this.unitForm.patchValue({
                deadline: this.model.deadline,
                assignments: this.model.assignments
            });
        }
    }

}
