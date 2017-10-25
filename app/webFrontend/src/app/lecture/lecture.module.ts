import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LectureFormComponent} from './lecture-form/lecture-form.component';
import {LectureComponent} from './lecture.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {UnitModule} from '../unit/unit.module';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    UnitModule
  ],
  declarations: [
    LectureComponent,
    LectureFormComponent,
  ],
  exports: [
    LectureComponent,
    LectureFormComponent,
  ]
})
export class LectureModule {
}
