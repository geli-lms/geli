import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {UnitFormService} from "../../shared/services/unit-form.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {IAssignmentUnit} from "../../../../../../shared/models/units/IAssignmentUnit";
import {UploadFormComponent} from "../../shared/components/upload-form/upload-form.component";
import {IFileUnit} from "../../../../../../shared/models/units/IFileUnit";

@Component({
  selector: 'app-assignment-unit',
  templateUrl: './assignment-unit.component.html',
  styleUrls: ['./assignment-unit.component.scss']
})
export class AssignmentUnitComponent implements OnInit {
    @Input() assignmentUnit: IAssignmentUnit;
    @ViewChild(UploadFormComponent) public uploadForm: UploadFormComponent;

    allowedMimeTypes: string[];
    unitForm: FormGroup;
    uploadPath: string;

    constructor(public unitFormService: UnitFormService,
                public formBuilder: FormBuilder){ }

    ngOnInit() {
        this.uploadPath = '/api/units/' + this.assignmentUnit._id + '/assignment';
        this.allowedMimeTypes = ['text/plain'];

        this.unitFormService.unitInfoText = 'Assignments Info';
        this.unitFormService.headline = 'Assignments';

        this.unitForm = this.unitFormService.unitForm;

        this.unitForm.addControl('deadline', new FormControl(this.assignmentUnit.deadline));
        this.unitForm.addControl('assignments', new FormControl(this.assignmentUnit.assignments));

        if (this.assignmentUnit) {
            this.unitForm.patchValue({
                deadline: this.assignmentUnit.deadline,
                assignments: this.assignmentUnit.assignments
            });
        }
    }

    public startUpload() {
        try {
            this.uploadForm.fileUploader.uploadAll();
        } catch (error) {
        }
    }

    public onFileUploaded(event: IFileUnit) {
    }

    public onAllUploaded() {
        this.dialogRef.close(true);
    }

    public isObjectInQueue() {
        if (this.uploadForm) {
            return this.uploadForm.fileUploader.queue.length > 0;
        }
    }
}
