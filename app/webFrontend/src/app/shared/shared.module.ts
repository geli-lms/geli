import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '@angular/material';
import {GravatarDirective} from './directives/gravatar.directive';
import {DialogModule} from './modules/dialog/dialog.module';
import {UnitMenuComponent} from './components/unit-menu/unit-menu.component';
import { UserImageDirective } from './directives/user-image.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  declarations: [
    GravatarDirective,
    UnitMenuComponent,
    UserImageDirective
  ],
  exports: [
    GravatarDirective,
    DialogModule,
    UnitMenuComponent,
    UserImageDirective
  ]
})
export class SharedModule {
}
