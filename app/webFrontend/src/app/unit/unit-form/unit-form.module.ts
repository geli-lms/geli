/* tslint:disable:max-line-length */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CodeKataUnitFormComponent} from './code-kata-unit-form/code-kata-unit-form.component';
import {FreeTextUnitFormComponent} from './free-text-unit-form/free-text-unit-form.component';
import {TaskUnitEditComponent} from './task-unit-edit/task-unit-edit.component';
import {UnitFormComponent} from './unit-form.component';
import {UnitGeneralInfoFormComponent} from './unit-general-info-form/unit-general-info-form.component';
import {FileUploadComponent} from '../../upload/file-upload/file-upload.component';
import {VideoUploadComponent} from '../../upload/video-upload/video-upload.component';
import {MaterialModule} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AceEditorModule} from 'ng2-ace-editor';
import {FileUploadModule} from 'ng2-file-upload';
import {UnitModule} from '../unit.module';
import {FreeTextUnitEditorComponent} from './free-text-unit-form/free-text-unit-editor/free-text-unit-editor.component';
import {FreeTextUnitEditorDialog} from './free-text-unit-form/free-text-unit-editor/free-text-unit-editor-dialog/free-text-unit-editor.dialog';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    AceEditorModule,
    FileUploadModule,
    UnitModule
  ],
  declarations: [
    CodeKataUnitFormComponent,
    FreeTextUnitFormComponent,
    TaskUnitEditComponent,
    UnitFormComponent,
    UnitGeneralInfoFormComponent,
    FileUploadComponent,
    VideoUploadComponent,
    FreeTextUnitEditorComponent,
    FreeTextUnitEditorDialog
  ],
  exports: [
    CodeKataUnitFormComponent,
    FreeTextUnitFormComponent,
    TaskUnitEditComponent,
    UnitFormComponent,
    UnitGeneralInfoFormComponent,
    VideoUploadComponent,
  ],
  entryComponents: [
    FreeTextUnitEditorDialog
  ]
})
export class UnitFormModule {
}
