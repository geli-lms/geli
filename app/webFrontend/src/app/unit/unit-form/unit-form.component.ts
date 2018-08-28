import {Component, OnInit, Input, ViewChild} from '@angular/core';
import {ICourse} from '../../../../../../shared/models/ICourse';
import {ILecture} from '../../../../../../shared/models/ILecture';
import {IUnit} from '../../../../../../shared/models/units/IUnit';
import {FormBuilder, FormGroup} from '@angular/forms';
import {FreeTextUnitFormComponent} from './free-text-unit-form/free-text-unit-form.component';
import {CodeKataComponent} from '../code-kata-unit/code-kata-unit.component';
import {MatDialog, MatSnackBar} from '@angular/material';
import {FreeTextUnitService, NotificationService, UnitService} from '../../shared/services/data.service';
import {TaskUnitFormComponent} from './task-unit-form/task-unit-form.component';
import {UnitFormService} from '../../shared/services/unit-form.service';
import {CodeKataUnitFormComponent} from './code-kata-unit-form/code-kata-unit-form.component';
import {FileUnitFormComponent} from './file-unit-form/file-unit-form.component';

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

  // add all child-components here for extra Buttons etc. (see other unit types, eg. full-text)
  @ViewChild(FreeTextUnitFormComponent)
  private freeTextUnitFormComponent: FreeTextUnitFormComponent;

  @ViewChild(CodeKataComponent)
  private codeKataComponent: CodeKataComponent;

  @ViewChild(TaskUnitFormComponent)
  private taskUnitEditComponent: TaskUnitFormComponent;

  @ViewChild(CodeKataUnitFormComponent)
  private codeKataUnitFormComponent: CodeKataUnitFormComponent;

  @ViewChild(FileUnitFormComponent)
  private fileUnitFormComponent: FileUnitFormComponent;

  unitForm: FormGroup;


  constructor(private formBuilder: FormBuilder,
              private freeTextUnitService: FreeTextUnitService,
              private unitService: UnitService,
              private snackBar: MatSnackBar,
              public dialog: MatDialog,
              private notificationService: NotificationService,
              private unitFormService: UnitFormService) {
  }

  ngOnInit() {
    this.unitFormService.reset();

    this.unitFormService.model = this.model;
    this.unitFormService.course = this.course;
    this.unitFormService.lecture = this.lecture;
    this.unitForm = this.unitFormService.unitForm;
  }

  reset() {
   this.unitFormService.reset();
   this.onCancel();
  }

  async save() {
    return this.unitFormService.save(this.onDone);
  }
}
