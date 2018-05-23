/* tslint:disable:max-line-length */
import {ChangeDetectorRef, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CodeKataUnitFormComponent} from './code-kata-unit-form/code-kata-unit-form.component';
import {FreeTextUnitFormComponent} from './free-text-unit-form/free-text-unit-form.component';
import {TaskUnitEditComponent} from './task-unit-edit/task-unit-edit.component';
import {UnitFormComponent} from './unit-form.component';
import {UnitGeneralInfoFormComponent} from './unit-general-info-form/unit-general-info-form.component';
import {FileUnitFormComponent} from './file-unit-form/file-unit-form.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AceEditorModule} from 'ng2-ace-editor';
import {FileUploadModule} from 'ng2-file-upload';
import {UnitModule} from '../unit.module';
import {FreeTextUnitEditorComponent} from './free-text-unit-form/free-text-unit-editor/free-text-unit-editor.component';
import {FreeTextUnitEditorDialog} from './free-text-unit-form/free-text-unit-editor/free-text-unit-editor-dialog/free-text-unit-editor.dialog';
import {SharedModule} from '../../shared/shared.module';
import {UnitFormService} from '../../shared/services/unit-form.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
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
    FileUnitFormComponent,
    FreeTextUnitEditorComponent,
    FreeTextUnitEditorDialog
  ],
  exports: [
    CodeKataUnitFormComponent,
    FreeTextUnitFormComponent,
    TaskUnitEditComponent,
    UnitFormComponent,
    UnitGeneralInfoFormComponent
  ],
  providers: [
    UnitFormService
  ],
  entryComponents: [
    FreeTextUnitEditorDialog
  ]
})
export class UnitFormModule {
}
