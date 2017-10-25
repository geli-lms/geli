import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CodeKataUnitFormComponent} from './code-kata-unit-form/code-kata-unit-form.component';
import {FreeTextUnitFormComponent} from './free-text-unit-form/free-text-unit-form.component';
import {TaskUnitEditComponent} from './task-unit-edit/task-unit-edit.component';
import {UnitFormComponent} from './unit-form.component';
import {UnitGeneralInfoFormComponent} from './unit-general-info-form/unit-general-info-form.component';
import {FileUploadComponent} from '../../upload/file-upload/file-upload.component';
import {VideoUploadComponent} from '../../upload/video-upload/video-upload.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AceEditorModule} from 'ng2-ace-editor';
import {FileUploadModule} from 'ng2-file-upload';
import {SharedModule} from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    AceEditorModule,
    FileUploadModule
  ],
  declarations: [
    CodeKataUnitFormComponent,
    FreeTextUnitFormComponent,
    TaskUnitEditComponent,
    UnitFormComponent,
    UnitGeneralInfoFormComponent,
    FileUploadComponent,
    VideoUploadComponent
  ],
  exports: [
    CodeKataUnitFormComponent,
    FreeTextUnitFormComponent,
    TaskUnitEditComponent,
    UnitFormComponent,
    UnitGeneralInfoFormComponent,
    VideoUploadComponent
  ]
})
export class UnitFormModule {
}
