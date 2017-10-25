import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {GravatarDirective} from './directives/gravatar.directive';
import {DialogModule} from './modules/dialog.module';
import {UnitMenuComponent} from './components/unit-menu/unit-menu.component';
import {MaterialImportModule} from './modules/material-import.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialImportModule
  ],
  declarations: [
    GravatarDirective,
    UnitMenuComponent,
  ],
  exports: [
    GravatarDirective,
    DialogModule,
    MaterialImportModule,
    UnitMenuComponent
  ]
})
export class SharedModule {
}
