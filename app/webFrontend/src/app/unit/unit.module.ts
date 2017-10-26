import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AceEditorModule} from 'ng2-ace-editor';
import {TaskUnitComponent} from './task-unit/task-unit.component';
import {VideoUnitComponent} from './video-unit/video-unit.component';
import {FileUnitComponent} from './file-unit/file-unit.component';
import {FreeTextUnitComponent} from './free-text-unit/free-text-unit.component';
import {FreeTextUnitCoreComponent} from './free-text-unit/free-text-unit-core/free-text-unit-core.component';
import {CodeKataComponent} from './code-kata-unit/code-kata-unit.component';

import {MaterialModule} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FileUploadModule} from 'ng2-file-upload';
import {UnitComponent} from './unit.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FileUploadModule,
    AceEditorModule
  ],
  declarations: [
    UnitComponent,
    CodeKataComponent,
    FileUnitComponent,
    FreeTextUnitComponent,
    FreeTextUnitCoreComponent,
    TaskUnitComponent,
    VideoUnitComponent,
  ],
  providers: [],
  exports: [
    UnitComponent,
    CodeKataComponent,
    FileUnitComponent,
    FreeTextUnitComponent,
    FreeTextUnitCoreComponent,
    TaskUnitComponent,
    VideoUnitComponent,
  ],
})
export class UnitModule {
}
