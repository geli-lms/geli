import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '@angular/material';
import {GravatarDirective} from './directives/gravatar.directive';
import {DialogModule} from './modules/dialog/dialog.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  declarations: [
    GravatarDirective,
  ],
  exports: [
    GravatarDirective,
    DialogModule
  ]
})
export class SharedModule {
}
