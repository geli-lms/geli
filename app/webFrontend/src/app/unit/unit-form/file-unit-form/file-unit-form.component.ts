import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatSnackBar} from '@angular/material';
import {ICourse} from '../../../../../../../shared/models/ICourse';
import {ILecture} from '../../../../../../../shared/models/ILecture';
import {IFileUnit} from '../../../../../../../shared/models/units/IFileUnit';
import {UnitGeneralInfoFormComponent} from '../unit-general-info-form/unit-general-info-form.component';
import {UnitService} from '../../../shared/services/data.service';
import {ShowProgressService} from '../../../shared/services/show-progress.service';
import {PickMediaDialog} from '../../../shared/components/pick-media-dialog/pick-media-dialog.component';
import {IFile} from '../../../../../../../shared/models/mediaManager/IFile';
import {UnitFormService} from "../../../shared/services/unit-form.service";
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-file-unit-form',
  templateUrl: './file-unit-form.component.html',
  styleUrls: ['./file-unit-form.component.scss']
})
export class FileUnitFormComponent implements OnInit {

  @Input() course: ICourse;
  @Input() lecture: ILecture;
  @Input() model: IFileUnit;
  @Input() fileUnitType: string;

  unitForm: FormGroup;


  @ViewChild(UnitGeneralInfoFormComponent)
  public generalInfo: UnitGeneralInfoFormComponent;

  constructor(public snackBar: MatSnackBar,
              private unitService: UnitService,
              private showProgress: ShowProgressService,
              private dialog: MatDialog,
              private unitFormService: UnitFormService,
              private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.unitFormService.headline = this.fileUnitType === 'video' ? 'Add Videos' : 'Add Files';
    this.unitFormService.unitForm.addControl('files',new FormArray([]));


    this.unitForm = this.unitFormService.unitForm;

    this.buildForm();
  }

  buildForm(){
    for(const file of this.model.files) {
      this.addFileToForm(file);
    }
  }

  removeFile(file: any) {
    let files =  (<FormArray>this.unitForm.controls.files).controls;
    files = files.filter((currFile: any) => currFile.value !== file.value);
    (<FormArray>this.unitForm.controls.files).controls = files;
  }

  async openAddFilesDialog() {
    if (!this.course.media) {
      this.snackBar.open('Please add files first', '', {duration: 3000});
      return;
    }

    const allowedMimeTypes = (this.fileUnitType !== 'video') ? undefined : [
      'video/mp4',
      'video/webm',
      'video/ogg',
      'video/avi',
    ];

    const res = await this.dialog.open(PickMediaDialog, {
      data: {
        directoryId: this.course.media._id,
        allowedMimeTypes: allowedMimeTypes,
      },
    });

    res.afterClosed().subscribe(async value => {
      if (value) {
        value.forEach((val: IFile) => {
          // Check if file already added
          let alreadyExists = false;
          (<FormArray>this.unitForm.controls.files).controls.forEach(v => {
            if (val._id === v.value._id) {
              alreadyExists = true;
            }
          });

          // Add file
          if (!alreadyExists) {
            this.addFileToForm(val);
            // this.model.files.push(val);
          }
        });
        this.snackBar.open('Added files to unit', '', {duration: 2000});
      }
    });
  }

  addFileToForm(file: IFile){
    const fileControl = this.formBuilder.group({
      _id: new FormControl(),
      name: new FormControl(),
      link: new FormControl(),
      size: new FormControl(),
      mimeType: new FormControl()
    });

    if (file) {
      fileControl.patchValue({
        ...file
      });
    }

    (<FormArray> this.unitForm.controls['files']).push(fileControl);
  }
}
