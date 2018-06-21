import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material';
import {ICourse} from '../../../../../../../shared/models/ICourse';
import {ILecture} from '../../../../../../../shared/models/ILecture';
import {IFileUnit} from '../../../../../../../shared/models/units/IFileUnit';
import {UnitGeneralInfoFormComponent} from '../unit-general-info-form/unit-general-info-form.component';
import {UnitService} from '../../../shared/services/data.service';
import {ShowProgressService} from '../../../shared/services/show-progress.service';
import {IFile} from '../../../../../../../shared/models/mediaManager/IFile';
import {UnitFormService} from '../../../shared/services/unit-form.service';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {SnackBarService} from '../../../shared/services/snack-bar.service';
import {CourseMediaComponent} from '../../../course/course-edit/course-media/course-media.component';
import {FileIconService} from '../../../shared/services/file-icon.service';

@Component({
  selector: 'app-file-unit-form',
  templateUrl: './file-unit-form.component.html',
  styleUrls: ['./file-unit-form.component.scss']
})
export class FileUnitFormComponent implements OnInit {

  course: ICourse;
  lecture: ILecture;
  model: IFileUnit;

  @Input() fileUnitType: string;

  unitForm: FormGroup;


  @ViewChild(UnitGeneralInfoFormComponent)
  public generalInfo: UnitGeneralInfoFormComponent;

  constructor(public snackBar: SnackBarService,
              private unitService: UnitService,
              private showProgress: ShowProgressService,
              private dialog: MatDialog,
              private unitFormService: UnitFormService,
              private formBuilder: FormBuilder,
              private fileIcon: FileIconService) {
  }

  ngOnInit() {
    this.model = <IFileUnit> this.unitFormService.model;
    this.lecture = <ILecture> this.unitFormService.lecture;
    this.course = <ICourse> this.unitFormService.course;

    this.model.fileUnitType = this.fileUnitType;

    this.unitFormService.headline = this.fileUnitType === 'video' ? 'Add Videos' : 'Add Files';
    this.unitFormService.unitForm.addControl('files', new FormArray([]));

    this.unitForm = this.unitFormService.unitForm;




    this.buildForm();
  }

  buildForm() {
    for (const file of this.model.files) {
      this.addFileToForm(file);
    }
  }

  removeFile(file: any) {
    let files =  (<FormArray>this.unitForm.controls.files).controls;
    files = files.filter((currFile: any) => currFile.value !== file.value);
    (<FormArray>this.unitForm.controls.files).controls = files;
  }

  async openAddFilesDialog() {

    const allowedMimeTypes = (this.fileUnitType !== 'video') ? undefined : [
      'video/mp4',
      'video/webm',
      'video/ogg',
      'video/avi',
    ];

    const res = await this.dialog.open(CourseMediaComponent, {
      maxWidth: '90vw',
      maxHeight: '90vh',
      minWidth: '50vw',
      disableClose: true,
      data: {
        courseId: this.course._id,
        allowedMimeTypes: allowedMimeTypes
      }
    });


    /*
    if (!this.unitFormService.course.media) {
      this.snackBar.openShort('Please add files first');
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
    });*/

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
        this.snackBar.openShort('Added files to unit');
      }
    });
  }

  addFileToForm(file: IFile) {
    // create new fileControl as formGroup
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

    // add new element at end of files array
    (<FormArray> this.unitForm.controls['files']).push(fileControl);
  }
}
